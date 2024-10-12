import { CategorySongs } from '@/components/category-songs'

export default function CategoryPage({ params }: { params: { letter: string } }) {
  return <CategorySongs categoryLetter={params.letter} />
}
