const ITEMS_PER_PAGE = 40;

export const getImages = async (searchQuery, page) => {  
  const { data } = await axios.get(`https://pixabay.com/api/?key=31831621-997ea1f90a535f6e50ab0825b&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${ITEMS_PER_PAGE}`);

  if (!data.hits.length) {
    throw new Error(404);
  }
  
  return data;
}