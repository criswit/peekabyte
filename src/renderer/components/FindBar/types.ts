export interface FindBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentMatch: number;
  totalMatches: number;
  goToNextMatch: () => void;
  goToPreviousMatch: () => void;
  hasMatches: boolean;
}
