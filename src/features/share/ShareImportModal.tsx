import { useEffect, useRef } from "react";
import Modal, { type ModalHandle } from "#/components/modal/Modal";
import Button from "#/components/button/Button";
import {
  SHARE_STORAGE_KEY,
  applyPendingShare,
  hasExistingData,
} from "#/shared/shareState";
import css from "./shareImportModal.module.css";

const ShareImportModal = () => {
  const modalRef = useRef<ModalHandle>(null);
  const shareIdRef = useRef<string | null>(null);

  useEffect(() => {
    const processPending = (id: string) => {
      shareIdRef.current = id;
      hasExistingData().then((hasData) => {
        if (!hasData) {
          void applyPendingShare(id);
        } else {
          modalRef.current?.showOnClick();
        }
      });
    };

    const id = sessionStorage.getItem(SHARE_STORAGE_KEY);
    if (id) processPending(id);
  }, []);

  const handleLoad = () => {
    if (shareIdRef.current) void applyPendingShare(shareIdRef.current);
  };

  const handleCancel = () => {
    sessionStorage.removeItem(SHARE_STORAGE_KEY);
    modalRef.current?.close();
  };

  return (
    <Modal
      ref={modalRef}
      title="Load shared build"
      onClose={handleCancel}
      className={css.modal}
    >
      <div className={css.body}>
        <p>Someone shared a build with you.</p>
        <p>Loading it will replace your current build.</p>
      </div>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={handleLoad}>
          Load build
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareImportModal;
