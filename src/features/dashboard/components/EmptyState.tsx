import { memo } from "react";

type Props = {
  title: string;
  description?: string;
};

function EmptyState({ title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
      
      <div className="text-4xl mb-2 opacity-60">
        📊
      </div>

      <p className="text-sm font-semibold">
        {title}
      </p>

      {description && (
        <p className="text-xs mt-1">
          {description}
        </p>
      )}
    </div>
  );
}

export default memo(EmptyState);