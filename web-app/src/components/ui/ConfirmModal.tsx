import { Button } from "./Button";

interface ModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal = ({ title, message, onConfirm, onCancel }: ModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
            <div className="bg-white p-6 rounded-2xl w-96">
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                    {title}
                </h2>
                <p className="text-gray-900 text-lg">{message}</p>
                <div className="flex justify-end gap-3 mt-5">
                    <Button
                        variant="secondary"
                        fullWidth={true}
                        onClick={() => onCancel()}
                    >Cancel</Button>
                    <Button
                    variant="dangerExtra"
                        fullWidth={true}
                        onClick={() => onConfirm()}
                    >Confirm</Button>
                </div>
            </div>
        </div>
    )
}