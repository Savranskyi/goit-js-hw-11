import axios from 'axios';

const API_KEY = '26909761-fdfaa7cc2eadbbc58c15a69c2';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function fetchImages(searchRequest, page, perPage) {
  const response = await axios.get(
    `?key=${API_KEY}&q=${searchRequest}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
  );
  return response;
}
