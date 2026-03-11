import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Result, Button } from 'antd';
import { QUERY_KEYS } from '@/utils/constants';
import { paymentService } from '@/services/payment.service';

export const PaymentSuccess = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const verifiedRef = useRef(false);

    useEffect(() => {
        if (verifiedRef.current) return;
        verifiedRef.current = true;

        const orderID = searchParams.get('order_id');
        if (!orderID) return;

        paymentService.verifyPayment(orderID).then(() => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH.PROFILE] });
        });
    }, [searchParams, queryClient]);

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#fafafa' }}>
            <Result
                status="success"
                title="Payment Successful!"
                subTitle="Your Pro plan is now active for 30 days. Enjoy all the features!"
                extra={[
                    <Button
                        type="primary"
                        key="dashboard"
                        size="large"
                        onClick={() => navigate('/tasks')}
                        style={{ background: '#eab308', borderColor: '#eab308', color: '#713f12', fontWeight: 700 }}
                    >
                        Go to Dashboard
                    </Button>
                ]}
            />
        </div>
    );
};

export default PaymentSuccess;
