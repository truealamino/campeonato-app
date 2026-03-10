export default function MataMata() {
  return (
    <div>
      <h2 className="text-3xl mb-6">Mata-Mata</h2>

      <div className="grid grid-cols-3 gap-8">
        <div>
          <h3>Play-in</h3>
          <div className="bg-zinc-800 p-4 rounded mb-4">2º A x 3º B</div>
          <div className="bg-zinc-800 p-4 rounded">2º B x 3º A</div>
        </div>

        <div>
          <h3>Semifinais</h3>
        </div>

        <div>
          <h3>Final</h3>
        </div>
      </div>
    </div>
  );
}
