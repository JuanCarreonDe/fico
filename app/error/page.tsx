"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-red-500 mb-4">
        Error de autenticación
      </h1>
      {message ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Mensaje del servidor:</p>
          <p>{message}</p>
        </div>
      ) : (
        <p>Lo sentimos, algo salió mal durante la autenticación.</p>
      )}
      <div className="mt-4">
        <a href="/login" className="text-blue-500 hover:underline">
          Volver al login
        </a>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="p-4">Cargando...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
