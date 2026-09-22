import ServiceDetailPage, { generateMetadata as productMetadata } from "../page";

type Props = { params: Promise<{ category: string; service: string; product: string }> };

async function productParams(params: Props["params"]) {
  const { category, service: subcategory, product: service } = await params;
  return { category, subcategory, service };
}

export async function generateMetadata({ params }: Props) {
  return productMetadata({ params: productParams(params) });
}

export default async function ProductPage({ params }: Props) {
  return ServiceDetailPage({ params: productParams(params) });
}
