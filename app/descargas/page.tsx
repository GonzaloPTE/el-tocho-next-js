import Footer from "@/components/Footer";
import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/Breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { DownloadCloud, Printer } from "lucide-react";

interface DownloadItem {
  id: string;
  url: string;
  name: string;
  year: number;
  editor: string;
  description: string;
  imageUrl: string; // Added imageUrl field
  imageAlt: string; // Added imageAlt field for accessibility
}

const downloadItems: DownloadItem[] = [
  {
    id: "el-tocho-7",
    url: "https://descargas.cantoraleltocho.com/el-tocho-7-coro9.pdf",
    name: "El Tocho 7",
    year: 2017,
    editor: "Coro9 (C9)",
    description: "La séptima edición de nuestro querido cantoral. Esta versión imprimible en PDF continúa la misión de 'El Tocho', recopilando cantos significativos y ofreciendo un recurso práctico y actualizado para la animación litúrgica, fruto del trabajo y espíritu misionero del Coro9.",
    imageUrl: "/images/el-tocho-7-pdf-portada.jpg", // Placeholder image path
    imageAlt: "Portada de El Tocho 7",
  },
  {
    id: "el-tocho-6",
    url: "https://descargas.cantoraleltocho.com/el-tocho-6-coro9.pdf",
    name: "El Tocho 6",
    year: 2012,
    editor: "Coro9 (C9)",
    description: "Una valiosa edición anterior, disponible como PDF imprimible. 'El Tocho 6' representa un hito en el crecimiento de este proyecto, reuniendo cantos aprendidos en la labor parroquial y encuentros de la comunidad redentorista.",
    imageUrl: "/images/el-tocho-6-pdf-portada.jpg", // Placeholder image path
    imageAlt: "Portada de El Tocho 6",
  },
  {
    id: "el-tocho-5",
    url: "https://descargas.cantoraleltocho.com/el-tocho-5-coro9.pdf",
    name: "El Tocho 5",
    year: 2010,
    editor: "Coro9 (C9)",
    description: "Los orígenes disponibles en PDF. 'El Tocho 5' sienta las bases de esta iniciativa, con la idea de aunar canciones importantes a nivel personal y comunitario para los primeros componentes del coro.",
    imageUrl: "/images/el-tocho-5-pdf-portada.jpg", // Placeholder image path
    imageAlt: "Portada de El Tocho 5",
  },
];

export default async function DescargasPage() {
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Descargas" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <PageHeader />

      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12">
          <Breadcrumb items={breadcrumbItems} />

          <div className="space-y-6">
            <div className="prose prose-stone dark:prose-invert max-w-none">
              <div className="flex items-center mb-4">
                <h1 className="text-4xl sm:text-5xl font-merriweather font-bold text-stone-800 dark:text-stone-100 !mb-0">
                  Descarga "El Tocho" en PDF
                </h1>
              </div>
              <p className="text-lg text-stone-700 dark:text-stone-300 mb-4">
                "El Tocho" es más que un simple cantoral; es el fruto de un camino de fe y comunidad. Nació en el corazón del Coro de la Parroquia del Santísimo Redentor de Madrid, con el anhelo de reunir cantos que marcaron momentos personales y comunitarios.
              </p>
              <p className="text-lg text-stone-700 dark:text-stone-300 mb-4">
                Guiados por un espíritu misionero, este proyecto ha crecido de generación en generación gracias al Coro9, quienes continúan la labor de evangelizar a través de la música. Muchas de estas canciones surgieron de la vida parroquial, encuentros redentoristas (como 'Espinos' y Pascuas) y composiciones de jóvenes de la Pastoral Juvenil Vocacional Redentorista (PJVR).
              </p>
              <p className="text-lg text-stone-700 dark:text-stone-300 mb-4">
                Nuestra finalidad es ofrecer recursos sencillos y prácticos para la animación litúrgica. Esperamos que estas pautas y cantos sean de gran utilidad, especialmente para aquellos coros que inician su camino. Vuestra labor enriquece enormemente a la comunidad.
              </p>
              <p className="text-lg text-stone-700 dark:text-stone-300 mb-4">
                Queremos transmitir la alegría de ser cristianos a través de la música, pues ella no solo embellece la liturgia, sino que profundiza y acompaña el mensaje del Evangelio. Como San Alfonso Mª de Liguori nos enseñó, ponemos nuestros dones al servicio de la comunidad, buscando cantar con sentido y sentir a Dios en cada melodía.
              </p>
            </div>

            <div className="mt-8 prose prose-stone dark:prose-invert max-w-none text-center pt-4 pb-12">
                <h3 className="font-merriweather text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center justify-center my-4">
                    Un Proyecto Comunitario
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                    "El Tocho" es una invitación a unirse a la Misión de llevar la sobreabundante Redención a todos los rincones a través de la música. 
                    Agradecemos a quienes iniciaron esta labor, a quienes han formado parte, a todos los Redentoristas por su apoyo, y de manera especial al Coro9 por su dedicación en la edición y mantenimiento de "El Tocho" durante tantos años.
                </p>
            </div>

            <div className="prose prose-stone dark:prose-invert max-w-none mt-10">
              <h2 className="font-merriweather text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center">
                Versiones Disponibles para Descarga
              </h2>
              <p className="text-stone-600 dark:text-stone-300">
                Aquí encontrarás las diferentes ediciones de "El Tocho" en formato PDF imprimible. Cada una representa una etapa de este hermoso proyecto, listas para que las uses en tu comunidad o para tu oración personal.
              </p>
            </div>

            <div className="space-y-10 mt-6">
              {downloadItems.map((item) => (
                <div
                  key={item.id}
                  className="p-6 border border-stone-200 dark:border-stone-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-stone-800 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
                >
                  <div className="w-32 h-40 sm:w-36 sm:h-48 flex-shrink-0 relative rounded-md overflow-hidden shadow-md">
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                      sizes="(max-width: 640px) 128px, 144px" // For responsive image loading
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between w-full">
                    <div>
                      <h2 className="text-2xl font-semibold font-merriweather text-stone-700 dark:text-stone-200 mb-1">
                        {item.name}
                      </h2>
                      <div className="flex flex-wrap items-center text-sm text-stone-500 dark:text-stone-400 mb-2 space-x-2">
                        <span>Publicado en {item.year}</span>
                        <span className="text-stone-300 dark:text-stone-600">|</span>
                        <span>Editor: {item.editor}</span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 text-base mb-4">
                        {item.description}
                      </p>
                    </div>
                    <Link
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto self-start sm:self-end inline-flex items-center justify-center px-6 py-3 bg-stone-600 hover:bg-stone-700 dark:bg-stone-500 dark:hover:bg-stone-600 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 dark:focus:ring-offset-stone-900 dark:focus:ring-stone-400 whitespace-nowrap"
                      download
                    >
                      <DownloadCloud className="w-5 h-5 mr-2" />
                      Descargar PDF
                    </Link>
                  </div>
                </div>
              ))}
            </div>
             <div className="mt-12 prose prose-stone dark:prose-invert max-w-none text-center">
                <p className="text-sm text-stone-500 dark:text-stone-400 flex items-center justify-center">
                    <Printer className="w-4 h-4 mr-2 text-stone-400 dark:text-stone-500" />
                    Todos los archivos están en formato PDF listos para imprimir.
                </p>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
