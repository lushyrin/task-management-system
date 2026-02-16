import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface SpinnerProps {
    size?: 'small' | 'default' | 'large';
    fullScreen?: boolean;
    tip?: string;
}

const iconSizes = {
    small: <LoadingOutlined spin className="text-lg" />,
    default: <LoadingOutlined spin className="text-xl" />,
    large: <LoadingOutlined spin className="text-3xl" />,
};

const Spinner: React.FC<SpinnerProps> = ({
    size = 'default',
    fullScreen = false,
    tip
}) => {
    const icon = iconSizes[size];

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/90 z-50 animate-fade-in">
                <Spin indicator={icon} tip={tip} size={size} />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8 animate-fade-in">
            <Spin indicator={icon} tip={tip} size={size} />
        </div>
    );
};

export default Spinner;
