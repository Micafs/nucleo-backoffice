'use client';

import Icon from '@/components/Icon';
import { PRODUCTS, Product } from '@/lib/data';

interface Props {
  onNavigate: (r: { page: string; productId?: string; productTab?: string }) => void;
}

export default function ProductosPage({ onNavigate }: Props) {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="page-sub">Homologaciones y roadmaps por producto.</p>
        </div>
      </div>
      <div className="products-grid">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
        ))}
      </div>
    </>
  );
}

function ProductCard({ product, onNavigate }: { product: Product; onNavigate: Props['onNavigate'] }) {
  return (
    <div
      className="product-card"
      onClick={() => onNavigate({ page: 'product-detail', productId: product.id })}
    >
      <div className="product-card-header">
        <div className="product-glyph" style={{ background: product.color }}>
          {product.glyph}
        </div>
        <div>
          <h3 className="product-card-name">{product.name}</h3>
          <p className="product-card-desc">{product.description}</p>
        </div>
      </div>
      <div className="product-card-links">
        <button
          className="product-card-link"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate({ page: 'product-detail', productId: product.id, productTab: 'homologacion' });
          }}
        >
          <Icon name="activity" size={13} />
          Homologaciones
        </button>
        <button
          className="product-card-link"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate({ page: 'product-detail', productId: product.id, productTab: 'roadmap' });
          }}
        >
          <Icon name="calendar" size={13} />
          Roadmap
        </button>
      </div>
    </div>
  );
}
