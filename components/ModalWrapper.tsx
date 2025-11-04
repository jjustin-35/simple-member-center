"use client";

const ModalWrapper = ({
  dialogRef,
  children,
  onClose,
}: {
  dialogRef: React.RefObject<HTMLDialogElement>;
  children: React.ReactNode;
  onClose?: () => void;
}) => {
  const handleClose = () => {
    if (onClose) onClose();
    if (dialogRef) dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black backdrop:opacity-50 backdrop:backdrop-blur-sm fixed inset-0 m-auto max-w-md max-h-fit rounded-lg shadow-lg border-0 p-0 bg-transparent"
    >
      <div className="bg-white p-4 flex flex-col items-center justify-center rounded-lg">
        <button onClick={handleClose} className="text-2xl self-start">
          x
        </button>
        {children}
      </div>
    </dialog>
  );
};

export default ModalWrapper;
