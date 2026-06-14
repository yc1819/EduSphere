const AbsenteesCard = ({
  absentees,
  students = [],
  present = {},
}) => {

  // ✅ SUPPORT BOTH METHODS
  const finalAbsentees =
    absentees ||
    students.filter(
      (student) => !present[student.id]
    );

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border dark:border-gray-700 w-full transition-all duration-300">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">

        <h3 className="text-lg font-semibold text-black dark:text-white">
          Absentees Today
        </h3>

        <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
          {finalAbsentees.length}
        </span>
      </div>

      {/* LIST */}
      {finalAbsentees.length > 0 ? (

        <ul className="space-y-3 max-h-80 overflow-y-auto pr-1">

          {finalAbsentees.map(
            (student, index) => (
              <li
                key={student.id || index}
                className="flex items-center justify-between border-b dark:border-gray-700 pb-3"
              >

                {/* LEFT */}
                <div>

                  <p className="font-medium text-black dark:text-white">
                    {student.name}
                  </p>

                  <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-300 mt-1">

                    {student.roll && (
                      <span>
                        Roll: {student.roll}
                      </span>
                    )}

                    {student.course && (
                      <span>
                        • {student.course}
                      </span>
                    )}
                  </div>
                </div>

                {/* BADGE */}
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                  Absent
                </span>
              </li>
            )
          )}
        </ul>

      ) : (

        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-300">
            No absentees 🎉
          </p>
        </div>

      )}
    </div>
  );
};

export default AbsenteesCard;