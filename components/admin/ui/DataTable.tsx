import React from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import Skeleton from './Skeleton';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  onSort?: (key: string) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  rowHeaderClass?: string;
}

export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  sortConfig = null,
  onSort,
  isLoading = false,
  emptyState,
  rowHeaderClass = 'bg-[#111318] border-b border-[#30363D]',
}: DataTableProps<T>) {
  
  if (isLoading) {
    return (
      <div className="border border-[#21262D] rounded-xl overflow-hidden bg-[#161B22]">
        <div className={`${rowHeaderClass} p-4 flex gap-4`}>
          {columns.map((col, i) => (
            <div key={i} className="h-4 bg-[#21262D] rounded animate-pulse w-full"></div>
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex gap-4 border-b border-[#21262D] last:border-0 hover:bg-[#1C2128]">
            {columns.map((_, j) => (
              <div key={j} className="h-4 bg-[#21262D] rounded animate-pulse w-full"></div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="overflow-x-auto border border-[#21262D] rounded-xl bg-[#161B22] shadow-sm">
      <table className="min-w-full divide-y divide-[#30363D]">
        <thead className={rowHeaderClass}>
          <tr>
            {columns.map((col, idx) => {
              const sortKey = String(col.key);
              const isSorted = sortConfig?.key === sortKey;
              const isSortable = col.sortable !== false && onSort;

              return (
                <th
                  key={sortKey || idx}
                  scope="col"
                  className={`px-6 py-3.5 text-left text-xs font-semibold text-[#8B949E] uppercase tracking-wider ${isSortable ? 'cursor-pointer hover:text-[#E6EDF3] group' : ''}`}
                  onClick={() => isSortable && onSort(sortKey)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.header}</span>
                    {isSortable && (
                      <span className="text-[#484F58] group-hover:text-[#8B949E]">
                        {isSorted ? (
                          sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 opacity-50 transition-opacity group-hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#21262D]">
          {data.map((item, rowIndex) => (
            <tr key={keyExtractor(item)} className="hover:bg-[#1C2128] transition-colors group">
              {columns.map((col, colIndex) => (
                <td key={`${keyExtractor(item)}-${colIndex}`} className="px-6 py-4 whitespace-nowrap text-sm text-[#E6EDF3]">
                  {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
