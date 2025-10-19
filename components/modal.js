import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

function CustomModal({ 
  visible, 
  onClose, 
  title = '', 
  showCloseButton = true, 
  children 
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Overlay untuk latar belakang */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Konten Modal */}
        <View style={styles.modalContainer}>
          
          {/* Jika ada title, tampilkan */}
          {title ? <Text style={styles.title}>{title}</Text> : null}

          {/* Isi modal dari komponen luar */}
          <View style={styles.content}>{children}</View>

          {/* Tombol Tutup opsional */}
          {showCloseButton && (
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Tutup</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

// Styling
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  content: {
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#AA0002',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CustomModal;
