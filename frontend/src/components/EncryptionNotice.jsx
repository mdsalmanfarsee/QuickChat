import { Lock } from "lucide-react";

const EncryptionNotice = () => {
    return (
        <div className="flex items-center justify-center text-gray-500 text-xs py-2">
            <Lock size={14} className="mr-1" />
            <span>Messages are end-to-end encrypted</span>
        </div>
    );
};

export default EncryptionNotice;
