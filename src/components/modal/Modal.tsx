import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
  useImperativeHandle,
  useRef,
} from "react";
import { classnames } from "#/shared/classnames";
import css from "./modal.module.css";

const ModalFooter = ({ children }: { children: ReactNode }) => (
  <footer className={css.footer}>{children}</footer>
);

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
    <dialog ref={dialogRef} {...props} className={classnames({ [css.modal]: true }, props.className ? [props.className] : [])}>
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

Modal.Footer = ModalFooter;

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
