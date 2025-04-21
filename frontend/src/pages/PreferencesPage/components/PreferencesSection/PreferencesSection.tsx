import { ReactNode } from 'react';

interface Props {
  title: string;
  icon?: any;
  children: ReactNode;
}

export const PreferencesSection = ({ title, icon, children }: Props) => {
  const renderIcon = () => {
    if (!icon) {
      return null;
    }
    return <img src={icon} />;
  };

  return (
    <div className="my-5 mb-8 space-y-5">
      <div className="w-full space-x-2 border-b border-b-gray-200 pb-1">
        {renderIcon()}
        <span className="text-xl font-medium">{title}</span>
      </div>
      <div className="px-3">{children}</div>
    </div>
  );
};
