import { useEffect, useState } from "react";
import { fetchQuery } from "./services/api";
import { Searchbar } from "./Searchbar/Searchbar";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Button } from "./Button/Button";
import { Loader } from "./Loader/Loader";
import { Modal } from "./Modal/Modal";

export const App = () => {
  const [photos, setPhotos] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState("");

  useEffect(() => {
    const asyncFunction = async () => {
      try {
        setIsLoading(true);

        const photosSearching = await fetchQuery(searchValue, page);

        const searchedPhotos = photosSearching.map((photo) => {
          return {
            id: photo.id,
            webformatURL: photo.webformatURL,
            largeImageURL: photo.largeImageURL,
            tags: photo.tags,
          };
        });
        searchValue !== "" && setPhotos((p) => [...p, ...searchedPhotos]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    asyncFunction();
  }, [searchValue, page]);

  const searchingResult = (evt) => {
    setPhotos([]);
    setPage(1);
    setSearchValue(evt);
  };

  const handleModal = (imgShow) => setModal(imgShow);

  const handleLoadBtn = () => {
    if (photos.length < 12) return "none";
  };

  const loadMorePhotos = () => {
    setPage(p => p + 1);

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }, 500);
  };

  const secondTimeHandleModal = (evt) => {
    setModal(evt);
  };

  return (
    <>
      <Searchbar onSubmit={searchingResult} />
      <ImageGallery photos={photos} imgShow={handleModal} />
      {isLoading && <Loader />}
      <div className="BtnContainer" style={{ display: handleLoadBtn() }}>
        {!isLoading && <Button onClick={loadMorePhotos} />}
      </div>
      {modal !== "" && (
        <Modal imgShow={modal} onClick={secondTimeHandleModal} />
      )}
    </>
  );
};
