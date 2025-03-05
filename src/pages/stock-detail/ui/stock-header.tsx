import { HeartIcon } from './icon.tsx';
import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { stockQueries } from '@/entities/stock/api/query.ts';
import { userQueries } from '@/shared/api/query';
import { stockFavoriteMutation, stockFavoriteQueries } from '../api/query';

type StockProps = {
  stockCode: string;
};

export function StockHeader({ stockCode }: StockProps) {
  const queryClient = useQueryClient();
  const { data: stock } = useSuspenseQuery(stockQueries.summary(stockCode));
  const { data: user } = useQuery(userQueries.me());
  const { data: favoriteStocks } = useQuery({
    ...stockFavoriteQueries.like({ userId: user?.userId ?? 0, stockCode }),
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  const addFavoriteMutation = useMutation({
    ...stockFavoriteMutation.like,
    onSuccess: () => {
      queryClient.setQueryData(
        ['favorite-stocks', { userId: user?.userId, stockCode }],
        true
      );
    },
  });

  const removeFavoriteMutation = useMutation({
    ...stockFavoriteMutation.unlike,
    onSuccess: () => {
      queryClient.setQueryData(
        ['favorite-stocks', { userId: user?.userId, stockCode }],
        false
      );
    },
  });

  const isFavorite = favoriteStocks;

  const handleLikeButton = () => {
    if (!user?.userId) return;

    if (isFavorite) {
      removeFavoriteMutation.mutate({
        userId: user.userId,
        stockCode,
      });
    } else {
      addFavoriteMutation.mutate({
        userId: user.userId,
        stockCode,
      });
    }
  };

  const getPriceColor = (changeRate: number) => {
    if (changeRate > 0) return 'text-[#D9001B]';
    if (changeRate < 0) return 'text-[#0074D9]';
    return 'text-neutral-500';
  };

  const getPriceSymbol = (changeRate: number) => {
    if (changeRate > 0) return '▲';
    if (changeRate < 0) return '▼';
    return '';
  };

  const changeRate = parseFloat(stock.changeRate);
  const priceColor = getPriceColor(changeRate);
  const priceSymbol = getPriceSymbol(changeRate);

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="w-fit rounded-[5px] bg-[#FFB400] px-4 py-1 font-bold text-white">
        {stock.mrktName}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLikeButton}
          className="flex items-center justify-center p-1"
        >
          <HeartIcon
            className={`h-8 w-8 ${isFavorite ? 'fill-[#D94F70]' : 'fill-neutral-300'}`}
          />
        </button>
        <div className="flex gap-6">
          <h2>
            <span className="text-3xl font-bold">{stock.name}</span> (
            <span className="code text-neutral-600">{stockCode}</span>)
          </h2>
          <div className={`flex items-end gap-2 ${priceColor}`}>
            <p className="text-3xl font-bold"> {stock.price}원 </p>
            <p className="font-bold">
              {priceSymbol} {stock.change}
            </p>
            <p className="font-bold"> ({stock.changeRate}%) </p>
          </div>
        </div>
      </div>
    </div>
  );
}
