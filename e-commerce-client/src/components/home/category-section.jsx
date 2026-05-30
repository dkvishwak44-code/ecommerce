// components/home/CategorySection.jsx

const categories = ["Fashion", "Shoes", "Electronics", "Beauty", "Accessories"];

export default function CategorySection() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* TITLE */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Categories
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              Shop By Categories
            </h2>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((item) => (
            <div
              key={item}
              className="
                group
                rounded-2xl
                bg-background
                border
                border-gray-200
                p-8
                text-center
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
                dark:border-gray-800
                dark:bg-gray-900
              "
            >
              {/* ICON */}
              <div
                className="
                  mx-auto
                  mb-5
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                  transition
                  group-hover:bg-black
                  dark:bg-gray-800
                  dark:group-hover:bg-white
                "
              >
                <span
                  className="
                    text-2xl
                    transition
                    group-hover:text-white
                    dark:text-white
                    dark:group-hover:text-black
                  "
                >
                  🛍️
                </span>
              </div>

              {/* TITLE */}
              <h3
                className="
                  text-lg
                  font-semibold
                  transition
                  group-hover:text-black
                  dark:text-white
                  dark:group-hover:text-white
                "
              >
                {item}
              </h3>

              {/* SUBTEXT */}
              <p
                className="
                  mt-2
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Explore latest {item.toLowerCase()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
