import React from 'react';
import { ShoppingCart, Search, ShoppingBag, Award, TrendingUp, Info } from 'lucide-react';

export default function ShopperIntelligenceMatrix({ shopperData }) {
  if (!shopperData || !shopperData.is_ecommerce_property) {
    return (
      <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-sky-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-slate-400" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">E-Commerce Shopper & Marketplace Intelligence</h3>
              <p className="text-xs text-slate-500">Marketplace on-site queries, SKU category conversion rates, and brand shares</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-full text-xs border border-slate-200">
            Property Not Applicable
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 text-xs text-slate-600 leading-relaxed flex items-start gap-3">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <p>
            <strong>B2B / Agency Service Property:</strong> Shopper intelligence is calibrated exclusively for retail marketplaces (e.g., Amazon, Walmart) and direct-to-consumer e-commerce carts. This domain is classified as a service agency with no consumer shopping cart activity.
          </p>
        </div>
      </div>
    );
  }

  const {
    top_on_site_queries = [],
    category_conversions = [],
    brand_shares = []
  } = shopperData;

  return (
    <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-sky-100">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-base">E-Commerce Shopper & Marketplace Intelligence</h3>
            <p className="text-xs text-slate-500">Marketplace on-site queries, SKU category conversion rates, and brand shares</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-full text-xs border border-indigo-200">
          Similarweb Shopper Matrix
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* On-Site Marketplace Queries */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-indigo-600" /> Top On-Site Marketplace Queries
          </h4>
          <div className="border border-sky-100 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-sky-50/50 text-slate-600 font-semibold border-b border-sky-100">
                <tr>
                  <th className="py-2.5 px-3">On-Site Query</th>
                  <th className="py-2.5 px-3 text-right">Volume</th>
                  <th className="py-2.5 px-3 text-right">Conv. %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-50 text-slate-800">
                {top_on_site_queries.map((q, idx) => (
                  <tr key={idx} className="hover:bg-sky-50/30">
                    <td className="py-2 px-3 font-medium text-slate-900 truncate max-w-xs">&ldquo;{q.query}&rdquo;</td>
                    <td className="py-2 px-3 text-right font-mono">{q.volume.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-indigo-600">{q.conversion_share}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Add-to-Cart & Purchase Conversions */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" /> SKU Category Conversions
          </h4>
          <div className="space-y-2">
            {category_conversions.map((cc, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-indigo-50/30 border border-indigo-100 space-y-1 text-xs">
                <div className="font-bold text-slate-900">{cc.category_name}</div>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Add-to-Cart Rate: <strong className="text-indigo-700">{cc.add_to_cart_rate}%</strong></span>
                  <span>Purchase Conv: <strong className="text-emerald-700">{cc.purchase_conversion_rate}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Purchase Share */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-600" /> Brand Purchase Share (%)
          </h4>
          <div className="space-y-2">
            {brand_shares.map((bs, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>{bs.brand_name}</span>
                  <span className="font-mono text-indigo-700 font-bold">{bs.market_share}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${bs.market_share}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
