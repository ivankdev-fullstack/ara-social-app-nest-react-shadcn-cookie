import { IPost } from '@/_common/interfaces';
import { useNavigate } from 'react-router-dom';

interface Props {
  hit: IPost;
}

export const SearchItem = ({ hit }: Props) => {
  const navigate = useNavigate();
  const maxTitleLength = 30;
  const maxContentLength = 40;

  let trimmedTitle = null;
  if (hit.title.length > maxTitleLength) {
    trimmedTitle = `${hit.title.slice(0, maxTitleLength)}...`;
  }
  let trimmedContent = null;
  if (hit.content.length > maxContentLength) {
    trimmedContent = `${hit.content.slice(0, maxContentLength)}...`;
  }

  return (
    <div
      key={hit?.objectID}
      className="cursor-pointer rounded-sm p-2 hover:bg-gray-100"
      onClick={() => navigate(`/posts/${hit?.objectID}`)}
    >
      <p className="font-semibold">{trimmedTitle ?? hit.title}</p>
      <p className="text-sm text-gray-500">{trimmedContent ?? hit.content}</p>
    </div>
  );
};
