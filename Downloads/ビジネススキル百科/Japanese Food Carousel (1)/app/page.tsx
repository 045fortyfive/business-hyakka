import FoodCarousel from "@/components/food-carousel"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8">美味しい料理をお届け</h1>
        <FoodCarousel />
      </div>
    </main>
  )
}
