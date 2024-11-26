import React, { ReactNode, CSSProperties } from "react";
import { styles } from "./modalStyles"; // Importe os estilos

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void; // Adicionado para ações de confirmação
    children: ReactNode;
  }
  
  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, children }) => {
    if (!isOpen) return null;
  
    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <button style={styles.closeButton} onClick={onClose}>
            Fechar
          </button>
          <div>{children}</div>
          {onConfirm && (
            <div style={styles.actions}>
              <button style={styles.confirmButton} onClick={onConfirm}>
                Confirmar
              </button>
              <button style={styles.cancelButton} onClick={onClose}>
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

export default Modal;
