import axios from 'axios';
const KEY = '33109675-647afcf76cb57c4c0eb06a2e1';

export const fetchPics = async (name, page = 1) => {
  const data = await axios.get(
    `https://pixabay.com/api/?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  if (data.status === 404) {
    throw new Error(`ERROR: ${data.status}`);
  }
  return data;
};
