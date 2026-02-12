import React, { useState } from 'react';
import { PricingItem } from '../types';
import { ArrowUp, ArrowDown, ExternalLink, Factory, CheckCircle2, Tag } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PricingTableProps {
  data: PricingItem[];
}

export const PricingTable: React.FC<PricingTableProps> = ({ data }) => {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('asc'); // Default low to high for pricing usually

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    return sortOrder === 'desc' ? b.price - a.price : a.price - b.price;
  });

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const formatPrice = (price: number, currency: string) => {
      let code = currency.toUpperCase();
      if (currency === '$') code = 'USD';
      if (currency === '₹') code = 'INR';
      const locale = code === 'INR' ? 'en-IN' : 'en-US';
      try {
          return new Intl.NumberFormat(locale, { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(price);
      } catch (e) {
          return `${currency} ${price}`;
      }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Charts Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6 shadow-sm">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Market Price Distribution</h3>
            <span className="text-xs text-gray-400">Low to High</span>
         </div>
         <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="company" tick={{fontSize: 10}} interval={0} height={30} tickFormatter={(val) => val.substring(0, 10)} />
                    <YAxis tick={{fontSize: 10}} tickFormatter={(val) => new Intl.NumberFormat('en-IN', { notation: "compact", compactDisplay: "short" }).format(val)} />
                    <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                        formatter={(value: number, name: string, props: any) => [formatPrice(value, props.payload.currency), 'Price']}
                    />
                    <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                        {sortedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`rgba(59, 130, 246, ${0.4 + (index * 0.1)})`} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-[20%]">Company / Brand</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-[20%]">USP</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-[30%]">Specifications</th>
                <th 
                  className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors w-[15%] text-right"
                  onClick={toggleSort}
                >
                  <div className="flex items-center justify-end gap-1">
                    Price
                    {sortOrder === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                  </div>
                </th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-[15%] text-center">Verify</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedData.map((item, idx) => (
                <tr key={idx} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="py-4 px-6 align-top">
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-sm">{item.company}</span>
                        {item.brand && item.brand !== item.company && (
                             <span className="text-xs text-gray-500 mt-1">{item.brand}</span>
                        )}
                    </div>
                  </td>
                  <td className="py-4 px-6 align-top">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                         <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                         <span className="text-xs leading-relaxed">{item.usp}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 align-top">
                     <div className="flex items-start gap-2 text-sm text-gray-600">
                        <Tag className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">{item.specs}</span>
                     </div>
                  </td>
                  <td className="py-4 px-6 align-top text-right">
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-bold border border-green-100 whitespace-nowrap">
                        {formatPrice(item.price, item.currency)}
                    </span>
                  </td>
                  <td className="py-4 px-6 align-middle text-center">
                    {item.link ? (
                        <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                            title="Verify Source"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    ) : (
                        <span className="text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
