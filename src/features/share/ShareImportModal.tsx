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
  const encodedRef = useRef<string | null>(null);

  useEffect(() => {
    const processPending = (encoded: string) => {
      encodedRef.current = encoded;
      hasExistingData().then((hasData) => {
        if (!hasData) {
          void applyPendingShare(encoded);
        } else {
          modalRef.current?.showOnClick();
        }
      });
    };

    const encoded = sessionStorage.getItem(SHARE_STORAGE_KEY);
    if (encoded) processPending(encoded);

    const onHashChange = () => {
      const hash = location.hash;
      if (!hash.startsWith("#s=")) return;
      const payload = hash.slice(3);
      sessionStorage.setItem(SHARE_STORAGE_KEY, payload);
      history.replaceState(null, "", location.pathname + location.search);
      processPending(payload);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleLoad = () => {
    if (encodedRef.current) void applyPendingShare(encodedRef.current);
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
