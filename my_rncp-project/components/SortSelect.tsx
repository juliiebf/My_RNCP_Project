type SortOption = {
  value: string;
  label: string;
};

const DEFAULT_OPTIONS: SortOption[] = [
  { value: 'popularity.desc', label: 'Les plus populaires' },
  { value: 'vote_average.desc', label: 'Mieux notés' },
  { value: 'release_date.desc', label: 'Plus récents' },
  { value: 'release_date.asc', label: 'Plus anciens' },
  { value: 'title.asc', label: 'A-Z' },
];

type SortSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options?: SortOption[];
};

export default function SortSelect({ value, onChange, options = DEFAULT_OPTIONS }: SortSelectProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-gray-300 font-medium">Trier par :</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}