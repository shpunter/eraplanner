import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
  useImperativeHandle,
  useRef,
} from "react";
import css from "./styles.module.css";

const Modal = ({ children, ref, title, onClose, ...props }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const onCloseInner = () => {
    onClose?.();
    dialogRef.current?.close();
  };

  useImperativeHandle(ref, () => ({
    getIsOpen: () => {
      return dialogRef.current?.open ?? false;
    },
    showOnClick: () => {
      dialogRef.current?.showModal();
    },
    close: () => {
      dialogRef.current?.close();
    },
  }));

  return (
    <dialog ref={dialogRef} className={css.modal} {...props}>
      <header className={css.header}>
        <strong>{title}</strong>
        <button
          type="button"
          className={css.close}
          onClick={onCloseInner}
          aria-label="Close modal"
        />
      </header>
      {children}
    </dialog>
  );
};

export default Modal;

export type ModalHandle = {
  showOnClick: () => void;
  close: () => void;
  getIsOpen: () => boolean;
};

type ModalProps = ComponentPropsWithoutRef<"dialog"> & {
  onClose?: () => void;
  children: ReactNode;
  title: string;
  ref: RefObject<ModalHandle | null>;
};
