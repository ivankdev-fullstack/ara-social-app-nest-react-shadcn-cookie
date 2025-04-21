import { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  count: number;
  action: () => void;
  active?: boolean;
}

export const PostAction = ({ icon, count, action, active }: Props) => {
  return (
    <div
      className="group flex flex-1 cursor-pointer items-center justify-center"
      onClick={action}
    >
      <button
        className={`group-hover:text-primary flex items-center gap-2 transition ${active ? 'text-primary' : 'text-muted-foreground'}`}
      >
        <span className="text-xs font-semibold">{count}</span>
        {icon}
      </button>
    </div>
  );
};
