export function Highlights() {
  const items = [
    {
      number: "1",
      title: "Made for book lovers",
      text: "Turn books, PDFs, and articles into audio in minutes.",
    },
    {
      number: "2",
      title: "Comfortable listening",
      text: "Natural narration you can enjoy on walks, commutes, or chores.",
    },
    {
      number: "3",
      title: "Your place saved",
      text: "Resume where you left off across devices.",
    },
  ];

  return (
    <section className="py-12">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
            For everyone who loves books
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Whether you're a learner, a lifelong reader, or an audiobook
            fan—Olog makes listening effortless.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {items.map((it) => (
            <div key={it.number} className="flex items-start gap-4">
              <div className="h-7 w-7 rounded-full border text-slate-700 grid place-items-center text-xs">
                {it.number}
              </div>
              <div className="space-y-1">
                <p className="font-medium text-slate-900">{it.title}</p>
                <p className="text-sm text-slate-600">{it.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
