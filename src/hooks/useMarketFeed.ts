import { useState, useEffect } from 'react';

export interface MarketTickerData {
  symbol: string;
  price: number;
  change24h: number;
  status: 'NORMAL' | 'HIGH_VOLATILITY' | 'CRITICAL_SPIKE';
  previousPrice: number;
  tickDelta: number;
  updatedAt: number;
}

const INITIAL_TICKERS: MarketTickerData[] = [
  {
    symbol: 'BTC-PERP',
    price: 64250.0,
    change24h: 3.42,
    status: 'NORMAL',
    previousPrice: 64250.0,
    tickDelta: 0,
    updatedAt: Date.now(),
  },
  {
    symbol: 'ETH-PERP',
    price: 3480.5,
    change24h: -1.85,
    status: 'NORMAL',
    previousPrice: 3480.5,
    tickDelta: 0,
    updatedAt: Date.now(),
  },
  {
    symbol: 'SOL-PERP',
    price: 145.2,
    change24h: 8.12,
    status: 'NORMAL',
    previousPrice: 145.2,
    tickDelta: 0,
    updatedAt: Date.now(),
  },
  {
    symbol: 'BNB-PERP',
    price: 590.15,
    change24h: 1.05,
    status: 'NORMAL',
    previousPrice: 590.15,
    tickDelta: 0,
    updatedAt: Date.now(),
  },
  {
    symbol: 'DOGE-PERP',
    price: 0.162,
    change24h: -4.2,
    status: 'NORMAL',
    previousPrice: 0.162,
    tickDelta: 0,
    updatedAt: Date.now(),
  },
  {
    symbol: 'XRP-PERP',
    price: 0.584,
    change24h: 0.45,
    status: 'NORMAL',
    previousPrice: 0.584,
    tickDelta: 0,
    updatedAt: Date.now(),
  },
  {
    symbol: 'AVAX-PERP',
    price: 35.8,
    change24h: 5.6,
    status: 'NORMAL',
    previousPrice: 35.8,
    tickDelta: 0,
    updatedAt: Date.now(),
  },
  {
    symbol: 'LINK-PERP',
    price: 18.45,
    change24h: 2.15,
    status: 'NORMAL',
    previousPrice: 18.45,
    tickDelta: 0,
    updatedAt: Date.now(),
  },
];

export function useMarketFeed() {
  const [tickers, setTickers] = useState<MarketTickerData[]>(INITIAL_TICKERS);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          let maxSwing = 0;

          if (t.price > 10000) maxSwing = 45;
          else if (t.price > 1000) maxSwing = 4;
          else if (t.price > 100) maxSwing = 0.8;
          else if (t.price > 10) maxSwing = 0.15;
          else maxSwing = 0.005;

          const delta = (Math.random() - 0.48) * maxSwing;

          let newPrice = t.price + delta;

          if (t.price < 1) {
            newPrice = Number(newPrice.toFixed(4));
          } else {
            newPrice = Number(newPrice.toFixed(2));
          }

          const volatility = Math.abs(delta) > maxSwing * 0.75;

          return {
            ...t,
            previousPrice: t.price,
            price: newPrice,
            tickDelta: Number(delta.toFixed(4)),
            status: volatility ? 'HIGH_VOLATILITY' : 'NORMAL',
            updatedAt: Date.now(),
          };
        }),
      );
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return tickers;
}