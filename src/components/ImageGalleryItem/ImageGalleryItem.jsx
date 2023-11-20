import React, { useState } from 'react';
import { Modal } from 'components/Modal/Modal';
import { ImageItem, Image } from './ImageGalleryItem.styled';

const ImageGalleryItem = ({ webformatURL, largeImageURL }) => {
  // Використання хука useState для відстеження стану модального вікна
  const [isModalOpen, setModalOpen] = useState(false);

  // Функція для відкриття модального вікна
  const openModal = () => {
    setModalOpen(true);
  };

  // Функція для закриття модального вікна
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <ImageItem onClick={openModal}>
        <Image src={webformatURL} alt="This is the result of your search" />
      </ImageItem>
      {/* Використання модального вікна замість компонента класу */}
      {isModalOpen && (
        <Modal imageUrl={largeImageURL} isModalOpen={isModalOpen} closeModal={closeModal} />
      )}
    </>
  );
};

export default ImageGalleryItem;
