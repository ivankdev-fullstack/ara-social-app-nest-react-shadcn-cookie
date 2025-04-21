interface Props {
  value: string;
  action: () => void;
}

export const OptionBtn = ({ value, action }: Props) => {
  return (
    <button
      className="rounded-sm p-1 px-4 text-right text-sm transition-colors hover:bg-gray-200"
      onClick={action}
    >
      {value}
    </button>
  );
};
