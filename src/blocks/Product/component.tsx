import React from 'react'
import type { ProductList, Header } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import {ProductInquery} from './product.form'
import {getCachedGlobal} from '@/utilities/getGlobals'

export const ProductBlock: React.FC<ProductList> =async ({ items }) => {
  const header: Header = await getCachedGlobal('header', 1)() as any
  const products = header.navItems?.filter(it=>it.link.parent==='Products').map(it=>it.link.label)!
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
      <div className="flex flex-col justify-center items-center">
        {items?.map((it, idx) => (
          <div key={idx}>
            <h3>{it.title}</h3>
            <Media resource={it.image} />
            <RichText
              className="ml-0 max-w-[48rem]"
              content={it.description}
              enableGutter={false}
            />
          </div>
        ))}
      </div>
      <div>
        <ProductInquery products={products}/>
      </div>
    </div>
  )
}
