import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';

export const PaymentCancel = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#fafafa' }}>
            <Result
                status="info"
                title="Payment Cancelled"
                subTitle="No worries — your current plan is unchanged. You can upgrade anytime."
                extra={[
                    <Button key="back" size="large" onClick={() => navigate('/tasks')}>
                        Back to App
                    </Button>
                ]}
            />
        </div>
    );
};

export default PaymentCancel;