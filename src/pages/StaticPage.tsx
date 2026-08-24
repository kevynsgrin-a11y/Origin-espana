const pages: Record<string, { title: string; body: JSX.Element }> = {
  'sobre-nosotros': {
    title: 'Sobre nosotros',
    body: (
      <>
        <p>
          Origen España es un recetario digital dedicado a la cocina tradicional española y catalana. Documentamos
          los platos que se han cocinado durante generaciones en las casas de este país: sopas y caldos, arroces,
          guisos, pescados, tapas, postres, panes y platos de huerta, organizados por categoría y por región.
        </p>
        <p>
          Creemos en una web ligera y respetuosa: sin anuncios invasivos, sin muros de suscripción y sin seguimiento
          publicitario. Cada receta indica sus ingredientes con cantidades, los tiempos reales de preparación y
          cocción, las raciones y la dificultad, con la elaboración explicada paso a paso.
        </p>
        <p>
          Este proyecto está en mejora continua: estamos ampliando las recetas con más contexto histórico, trucos y
          fotografía propia. Si detectas un error o quieres proponer una receta de tu familia, escríbenos desde la
          página de contacto.
        </p>
      </>
    ),
  },
  contacto: {
    title: 'Contacto',
    body: (
      <>
        <p>
          ¿Tienes una sugerencia, has detectado un error en una receta o quieres proponer una colaboración? Nos
          encantará leerte.
        </p>
        <p>
          Escríbenos a: <a className="text-terracotta underline" href="mailto:kevynsgrin@gmail.com">kevynsgrin@gmail.com</a>
        </p>
        <p>Intentamos responder a todos los mensajes en un plazo de pocos días laborables.</p>
      </>
    ),
  },
  privacidad: {
    title: 'Política de privacidad',
    body: (
      <>
        <p>
          <em>Última actualización: agosto de 2026.</em>
        </p>
        <p>
          Origen España (originespana.com) es un sitio web informativo de recetas. Nuestro principio es la
          minimización de datos: no requerimos registro, no utilizamos cookies publicitarias ni de seguimiento y no
          vendemos ni cedemos datos personales a terceros.
        </p>
        <h2>Datos que tratamos</h2>
        <p>
          Este sitio es estático y no recoge datos personales de forma activa. Si nos escribes por correo
          electrónico, trataremos tu dirección y el contenido del mensaje con la única finalidad de responderte
          (base jurídica: interés legítimo, art. 6.1.f RGPD), y lo conservaremos solo el tiempo necesario para
          gestionar tu consulta.
        </p>
        <h2>Almacenamiento local</h2>
        <p>
          Guardamos tu preferencia de idioma de la interfaz en el almacenamiento local de tu navegador. Este dato no
          sale de tu dispositivo y no permite identificarte.
        </p>
        <h2>Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad
          escribiendo a kevynsgrin@gmail.com. También puedes presentar una reclamación ante la Agencia Española de
          Protección de Datos (aepd.es).
        </p>
      </>
    ),
  },
  cookies: {
    title: 'Política de cookies',
    body: (
      <>
        <p>
          <em>Última actualización: agosto de 2026.</em>
        </p>
        <p>
          Origen España <strong>no utiliza cookies</strong>: ni propias, ni de terceros, ni publicitarias, ni de
          analítica.
        </p>
        <p>
          El único almacenamiento que puede crear este sitio en tu navegador es una preferencia de idioma de la
          interfaz guardada en el almacenamiento local (localStorage). No contiene datos personales, no se transmite
          a ningún servidor y puedes eliminarla en cualquier momento borrando los datos de navegación de tu
          navegador.
        </p>
        <p>
          Las tipografías del sitio se cargan desde Google Fonts, lo que implica una petición técnica a servidores de
          Google al cargar la página. Estamos trabajando en alojarlas directamente en nuestro servidor.
        </p>
      </>
    ),
  },
  'aviso-legal': {
    title: 'Aviso legal',
    body: (
      <>
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
          Información y de Comercio Electrónico (LSSI-CE), se informa:
        </p>
        <p>
          <strong>Titular del sitio:</strong> Origen España (originespana.com)
          <br />
          <strong>Contacto:</strong> kevynsgrin@gmail.com
        </p>
        <p>
          Los contenidos de este sitio (textos de recetas, estructura y diseño) están protegidos por derechos de
          propiedad intelectual. Se permite el uso personal y la cita con enlace a la fuente; no se permite la
          reproducción masiva con fines comerciales sin autorización.
        </p>
        <p>
          La información culinaria se ofrece a título informativo. El titular no se hace responsable del uso que se
          haga de las recetas ni de posibles reacciones alérgicas o intolerancias; comprueba siempre los ingredientes.
        </p>
      </>
    ),
  },
  estandares: {
    title: 'Nuestros estándares editoriales',
    body: (
      <>
        <p>
          Queremos que Origen España sea una fuente fiable de cocina tradicional. Estos son los principios que
          aplicamos a cada receta publicada:
        </p>
        <h2>Autenticidad</h2>
        <p>
          Documentamos recetas del recetario tradicional español y catalán, indicando su región de origen y su
          categoría. Cuando existen variantes regionales relevantes, lo señalamos.
        </p>
        <h2>Precisión</h2>
        <p>
          Cada receta incluye ingredientes con cantidades, tiempos de preparación y cocción, raciones y dificultad.
          Revisamos y corregimos las recetas de forma continua; si detectas un error, agradecemos que nos lo
          comuniques desde la página de contacto.
        </p>
        <h2>Imágenes</h2>
        <p>
          Parte de la fotografía actual procede de bancos de imágenes y es ilustrativa; estamos sustituyéndola
          progresivamente por fotografía propia y fiel a cada plato. Señalaremos claramente cualquier imagen generada
          digitalmente.
        </p>
        <h2>Independencia</h2>
        <p>
          No publicamos contenido patrocinado encubierto. Si en el futuro incluimos enlaces de afiliado, estarán
          claramente identificados junto al contenido correspondiente.
        </p>
      </>
    ),
  },
};

export default function StaticPage({ page }: { page: string }) {
  const content = pages[page];
  if (!content) return null;
  return (
    <div lang="es" className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="font-display font-bold text-4xl">{content.title}</h1>
      <div className="mt-8 space-y-4 leading-relaxed text-ink/80 [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:text-ink [&_h2]:mt-8">
        {content.body}
      </div>
    </div>
  );
}
