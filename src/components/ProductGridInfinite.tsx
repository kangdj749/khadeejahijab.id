"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import ProductCard from "@/components/ProductCard"
import ProductSkeleton from "@/components/ProductSkeleton"
import { Product } from "@/types"

interface Props {
  initialProducts: Product[]
}

export default function ProductGridInfinite({ initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts ?? [])
  const [page, setPage] = useState(initialProducts?.length ? 1 : 0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loaderRef = useRef<HTMLDivElement | null>(null)

  /* ===========================
     LOAD MORE (STABLE)
  ============================ */
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      const nextPage = page + 1
      const res = await fetch(`/api/products?page=${nextPage}&limit=8`)
      const data: Product[] = await res.json()

      if (!data.length) {
        setHasMore(false)
        return
      }

      setProducts((prev) => [...prev, ...data])
      setPage(nextPage)
    } catch (err) {
      console.error("❌ loadMore error:", err)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore])

  /* ===========================
     AUTO LOAD FIRST PAGE
  ============================ */
  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      loadMore()
    }
  }, [initialProducts, loadMore])

  /* ===========================
     INTERSECTION OBSERVER
  ============================ */
  useEffect(() => {
    if (!loaderRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: "200px" }
    )

    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  /* ===========================
     EMPTY STATE
  ============================ */
  if (!loading && products.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        Produk belum tersedia.
      </p>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {hasMore && <div ref={loaderRef} className="h-10" />}
    </>
  )
}
