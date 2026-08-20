type Option = { value: string; label: string };

export default function InputSelect({
  name,
  onChange,
  options = [],
  value,
}: {
  name?: string;
  onChange?: (v: string) => void;
  options?: Option[];
  value?: string;
}) {
  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      className="border px-2 py-1 rounded text-black bg-white border-border"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
