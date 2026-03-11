import { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { CheckOutlined, CrownOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/services/payment.service';
import { QUERY_KEYS } from '@/utils/constants';

interface UpgradeModalProps {
    open: boolean;
    onClose: () => void;
    reason?: string;
}

const features = [
    'Unlimited workspaces',
    'Unlimited tasks',
    'Full comment threads',
    'Team collaboration',
    'Priority support',
];

const colors = {
    accent: '#eab308',
    accentDark: '#713f12',
    text: '#171717',
    textMuted: '#737373',
    border: '#e5e5e5',
};

declare global {
    interface Window {
        snap: {
            pay: (token: string, options: {
                onSuccess: (result: any) => void;
                onPending: (result: any) => void;
                onError: (result: any) => void;
                onClose: () => void;
            }) => void;
        };
    }
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ open, onClose, reason }) => {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleUpgrade = async () => {
        if (!window.snap) {
            message.error('Payment gateway is not loaded. Please refresh and try again.');
            return;
        }

        setLoading(true);
        try {
            const { token } = await paymentService.createCheckout('pro');

            window.snap.pay(token, {
                onSuccess: async (result: any) => {
                    try {
                        await paymentService.verifyPayment(result.order_id);
                        await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH.PROFILE] });
                        message.success('Payment successful! Your plan has been upgraded.');
                        onClose();
                    } catch {
                        message.warning('Payment received. Your plan will be updated shortly.');
                        onClose();
                    }
                },
                onPending: () => {
                    message.info('Payment pending. We will update your plan once confirmed.');
                    setLoading(false);
                    onClose();
                },
                onError: () => {
                    message.error('Payment failed. Please try again.');
                    setLoading(false);
                },
                onClose: () => {
                    setLoading(false);
                },
            });
        } catch {
            message.error('Failed to initiate payment. Please try again.');
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={420}
            centered
            closeIcon={null}
            styles={{ body: { padding: 0 } }}
        >
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                borderRadius: '8px 8px 0 0',
                padding: '28px 28px 24px',
                textAlign: 'center',
                position: 'relative',
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: 18,
                        lineHeight: 1,
                        padding: 4,
                    }}
                >
                    ×
                </button>

                <CrownOutlined style={{ fontSize: 32, color: '#fff', marginBottom: 8 }} />
                <h2 style={{ color: '#fff', margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                    Upgrade to Pro
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', margin: '6px 0 0', fontSize: 14 }}>
                    {reason || 'Unlock more features for your workflow'}
                </p>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 28px 28px' }}>
                {/* Price */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: colors.text, letterSpacing: '-0.03em' }}>
                        Rp 49.000
                    </span>
                    <span style={{ color: colors.textMuted, fontSize: 14, marginLeft: 6 }}> / 30 days</span>
                </div>

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {features.map((f) => (
                        <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{
                                width: 20, height: 20, borderRadius: '50%',
                                background: '#dcfce7', color: '#16a34a',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, flexShrink: 0,
                            }}>
                                <CheckOutlined />
                            </span>
                            <span style={{ fontSize: 14, color: colors.text }}>{f}</span>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <Button
                    type="primary"
                    block
                    size="large"
                    loading={loading}
                    onClick={handleUpgrade}
                    style={{
                        background: colors.accent,
                        borderColor: colors.accent,
                        color: colors.accentDark,
                        fontWeight: 700,
                        height: 48,
                        borderRadius: 10,
                        fontSize: 15,
                    }}
                >
                    Pay with GoPay / QRIS / Virtual Account
                </Button>

                <p style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: colors.textMuted }}>
                    Secure payment via Midtrans · No auto-renewal
                </p>
            </div>
        </Modal>
    );
};

export default UpgradeModal;