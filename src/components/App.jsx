import React, { useState, useEffect } from 'react';
import { Blocks } from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';
import { fetchImages } from 'utils/api';

import SearchBar from './SearchBar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';

const AppStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridGap: '16px',
  paddingBottom: '24px',
};

const App = () => {
  // Стани компонента
  const [images, setImages] = useState([]); // Список зображень
  const [query, setQuery] = useState(''); // Пошуковий запит
  const [page, setPage] = useState(1); // Номер сторінки для завантаження
  const [isLoading, setIsLoading] = useState(false); // Індикатор завантаження
  const [loadMore, setLoadMore] = useState(false); // Індикатор можливості завантаження більше зображень

  // Ефект для виклику функції завантаження зображень при зміні query або page
  useEffect(() => {
    const fetchImagesData = async () => {
      try {
        const queryWithoutId = query.slice(query.indexOf('/') + 1);
        setIsLoading(true);

        // Завантаження зображень за допомогою API
        const fetchedImages = await fetchImages(queryWithoutId, page);

        // Оновлення стану зображень та інших даних
        setImages(prevImages => [...prevImages, ...fetchedImages.hits]);
        setLoadMore(page < Math.ceil(fetchedImages.totalHits / 12));
      } catch (error) {
        // Обробка помилки
        toast.error('Something went wrong! Please, try again :(  ');
      } finally {
        // Завершення процесу завантаження
        setIsLoading(false);
      }
    };

    // Запуск функції завантаження тільки якщо query не є пустим рядком
    if (query.trim() !== '') {
      fetchImagesData();
    }
  }, [query, page]); // Викликати ефект при зміні query або page

  // Обробник подання форми пошукового запиту
  const handleSubmit = newQuery => {
    if (!newQuery.trim()) {
      // Перевірка на пустий рядок
      toast.error('Enter something to search');
      return;
    }

    // Оновлення стану для нового пошукового запиту
    setImages([]);
    setQuery(`${Date.now()}/${newQuery}`);
    setPage(1);
  };

  // Обробник натискання кнопки "Завантажити ще"
  const handleLoadMore = () => {
    // Збільшення номеру сторінки для завантаження
    setPage(prevPage => prevPage + 1);
  };

  // Рендер компонента
  return (
    <div style={AppStyle}>
      {/* Компонент для введення пошукового запиту */}
      <SearchBar onSubmit={handleSubmit} />
      {/* Відображення індикатора завантаження */}
      {isLoading && (
        <Blocks
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
        />
      )}
      {/* Відображення галереї зображень, якщо вони є */}
      {images.length > 0 && <ImageGallery imagesList={images} />}
      {/* Відображення кнопки "Завантажити ще", якщо можна завантажити більше зображень */}
      {loadMore && <Button handleClick={handleLoadMore} />}
      {/* Відображення сповіщень */}
      <Toaster />
    </div>
  );
};

export default App;
