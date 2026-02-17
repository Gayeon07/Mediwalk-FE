interface ConfirmModalProps {
  title: string;
  detail: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal = ({
  title,
  detail,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <div className="absolute flex inset-0 z-60 bg-black/70 items-center justify-center backdrop-blur-md">
      <div className="flex flex-col bg-white p-5 gap-4 rounded-xl">
        <div className="flex flex-col gap-2">
          <div className="text-sub1_sb_18">{title}</div>
          <div>{detail}</div>
        </div>
        <div className="flex items-center justify-end">
          <button onClick={onClose} className="w-20 px-1 py-2">
            취소
          </button>
          <button onClick={onConfirm} className="w-20 px-1 py-2 text-primary">
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
