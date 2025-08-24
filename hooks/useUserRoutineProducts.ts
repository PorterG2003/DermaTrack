import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export interface UserRoutineProduct {
  _id: string;
  userId: string;
  role: 'cleanser' | 'moisturizer' | 'treatment' | 'serum' | 'sunscreen' | 'makeup' | 'hair_product' | 'other';
  name?: string;
  leaveOn?: boolean;
  ingredientList?: string[];
  fragranced?: boolean;
  startedAt?: number;
  active: boolean;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export function useUserRoutineProducts() {
  const products = useQuery(api.userRoutineProducts.getUserRoutineProducts);
  const addProduct = useMutation(api.userRoutineProducts.addRoutineProduct);
  const updateProduct = useMutation(api.userRoutineProducts.updateRoutineProduct);
  const deleteProduct = useMutation(api.userRoutineProducts.deleteRoutineProduct);

  const isLoading = products === undefined;

  const addNewProduct = async (productData: Omit<UserRoutineProduct, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    return await addProduct(productData);
  };

  const updateExistingProduct = async (productId: string, updateData: Partial<UserRoutineProduct>) => {
    return await updateProduct({
      productId: productId as any,
      ...updateData,
    });
  };

  const removeProduct = async (productId: string) => {
    return await deleteProduct({
      productId: productId as any,
    });
  };

  return {
    products,
    isLoading,
    addProduct: addNewProduct,
    updateProduct: updateExistingProduct,
    deleteProduct: removeProduct,
  };
}
