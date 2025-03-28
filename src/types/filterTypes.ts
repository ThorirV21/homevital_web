export interface FilterProps {
  header: string;
  description: string;
  items: FilterType[];
}

export interface FilterType {
  id: string;
  name: string;
  checked: boolean;
}
