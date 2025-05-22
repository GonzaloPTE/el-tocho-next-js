import { PageHeader } from "@/components/page-header";
import { Breadcrumb } from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Acerca de Cantoral El Tocho | Nuestra Historia y Misión",
  description: "Conoce la historia de Cantoral El Tocho, nuestro cantoral misionero. Descubre nuestra misión de evangelizar a través de la música y el trabajo del Coro9.",
  openGraph: {
    title: "Acerca de Cantoral El Tocho | Nuestra Historia y Misión",
    description: "Conoce la historia del Cantoral El Tocho, nuestro cantoral misionero. Descubre nuestra misión de evangelizar a través de la música y el trabajo del Coro9.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com"}/acerca-de`,
    siteName: "Cantoral El Tocho",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com"}/images/logo-1x1-1k.png`, 
        width: 1024, 
        height: 1024, 
        alt: "Cantoral El Tocho",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acerca de Cantoral El Tocho | Nuestra Historia y Misión",
    description: "Conoce la historia del Cantoral El Tocho, nuestro cantoral misionero. Descubre nuestra misión de evangelizar a través de la música y el trabajo del Coro9.",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com"}/images/logo-1x1-1k.png`], 
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || "https://cantoraleltocho.com"}/acerca-de`,
  },
};

export default async function AcercaDePage() {
  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Acerca de El Tocho" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <PageHeader />

      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto space-y-10 sm:space-y-12">
          <Breadcrumb items={breadcrumbItems} />

          <article className="prose prose-stone dark:prose-invert max-w-none">
            <div className="mb-12">
                <h1 className="text-4xl sm:text-5xl font-merriweather font-bold text-stone-800 dark:text-stone-100">
                    Nuestra Historia: ¿Qué es "El Tocho"?
                </h1>
            </div>

            <p className="lead text-lg mb-4">
                ¡Hola! Si tienes un minuto te explicaremos qué es "EL TOCHO".
            </p>
            <p className="mb-4">
                "El Tocho" es un cantoral cristiano que nació con la idea de aunar muchas canciones que eran importantes, tanto a nivel personal como comunitario, para los primeros componentes del coro de la Parroquia del Santísimo Redentor de Madrid. Guiados por un espíritu misionero, "El Tocho" fue creciendo de generación en generación, hasta llegar a los miembros actuales del Coro9 que continúan con esa labor de evangelizar a través de la música y de llegar a todos los rincones y a todas las personas.
            </p>
            
            <div className="mt-8 p-6 bg-stone-100 dark:bg-stone-800 rounded-lg shadow">
                <h2 className="font-merriweather text-2xl font-bold text-stone-700 dark:text-stone-200 mb-3 flex items-center">
                    El Corazón de Nuestros Cantos
                </h2>
                <p className="mb-4">
                    Muchos de los cantos que contiene los hemos aprendido con la labor parroquial del coro y en los distintos encuentros en los que participamos, especialmente en los que la comunidad redentorista nos ofrece (‘Espinos’, Pascuas, convivencias, encuentros con otras parroquias, etc.). También hay canciones compuestas por los propios jóvenes de la PJVR (Pastoral Juvenil Vocacional Redentorista), de la que forma parte el Coro9.
                </p>
            </div>

            <h2 className="font-merriweather text-3xl font-bold mt-10 mb-4 flex items-center">
                Nuestra Misión y Finalidad
            </h2>
            <p className="mb-4">
                La finalidad de "El Tocho" es recopilar una serie de recursos sencillos y prácticos que ayuden a todo aquel que quiera participar en el mundo de la animación litúrgica. Es por ello que también podrás encontrar algunas pautas en las diferentes secciones que, esperamos, te sean útiles. Desde el Coro9 queremos animar a todos aquellos pequeños coros que están iniciando su actividad y no saben por dónde empezar. Esperamos que "El Tocho" os ayude. Realmente vuestra tarea y esfuerzo ayuda mucho a la comunidad.
            </p>
            <p className="mb-4">
                Queremos resaltar la alegría que supone ser cristiano a través de la música, sobre todo en las celebraciones litúrgicas, porque la música no solo adorna, sino que acompaña y refuerza el mensaje que nos propone el Evangelio.
            </p>

            <blockquote className="border-l-4 border-stone-500 pl-4 italic my-8">
                Con el ejemplo de San Alfonso Mª de Liguori y bajo la idea de "En todo amar y servir" queremos poner nuestros dones al servicio de la comunidad. Nuestra función es la de animar las celebraciones. Animar es poner anima (es decir, alma) y, por ello, lo primero que hacemos en los ensayos es leer y rezar las lecturas del día, compartir nuestra reflexión para, a continuación, elegir los cantos que mejor transmita la Palabra y el mensaje de la celebración. Queremos cantar con sentido y sentir a Dios en cada canto.
            </blockquote>

            <h3 className="font-merriweather text-2xl font-semibold mt-8 mb-3">
                Tres Ideas para la Animación Litúrgica:
            </h3>
            <ul className="list-disc pl-5 space-y-2">
                <li><strong>Da sentido a lo que cantas:</strong> Lo que se canta con el corazón llega al corazón. Piensa en lo que estás cantando y no busques solo la belleza del canto sin más.</li>
                <li><strong>Ayuda a tu comunidad a cantar:</strong> El que canta ora dos veces. Por ello, haz posible a todos orar dos veces. Ensaya con la comunidad antes de la celebración, facilita que todos tengan la letra de las canciones…</li>
                <li><strong>Sé instrumento:</strong> La música ayuda a rezar a una comunidad en muchos momentos. Ponte al servicio para ser testigo del amor de Dios. Deja que sea Él quien hable y tan solo pon tus cualidades musicales al servicio de los demás.</li>
            </ul>
            <p className="mt-6 mb-4">
                Se puede cantar en muchos momentos y lugares, pero para nosotros la música es el medio por el que expresamos la alegría de sentirnos amados por Dios. Él es nuestra razón de ser, porque su voz es la que suena en cada nota y, sin Él, nada tiene sentido.
            </p>

            <div className="mt-10 pt-8">
                <h2 className="font-merriweather text-3xl font-bold mb-4 flex items-center">
                    Agradecimientos
                </h2>
                <p className="mb-4">
                    Finalmente, queremos agradecer a quienes iniciaron esta bonita Misión, a quienes habéis formado parte de ella en algún momento y a todos los Redentoristas que han estado con nosotros durante estos años. Vuestro apoyo, acompañamiento y cariño nos han enseñado y ayudado a ser lo que somos: <strong>¡GRACIAS!</strong>
                </p>
            </div>

            <div className="mt-10 text-center">
                <h2 className="font-merriweather text-2xl font-bold text-stone-700 dark:text-stone-200 mb-3 flex items-center justify-center">
                    ¡Únete a la Misión!
                </h2>
                <p className="mb-4">
                    Te agradecemos que uses "El Tocho" y te invitamos a que te unas a esta Misión de llevar la sobreabundante Redención a todos los rincones a través de la música. ¿Te animas?
                </p>
                <p className="mt-4 text-lg font-semibold mb-4">
                    Coro9 – Parroquia del Santísimo Redentor de Madrid
                </p>
                <p className="text-sm mb-4">
                    <Link href="https://www.redentoristas.org" className="underline text-stone-600 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200">
                        Misioneros Redentoristas de España <ArrowRight className="w-4 h-4 inline-block ml-1" />
                    </Link>
                </p>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
} 