export default function FullName({
  className = "w-full text-right text-xs p-2",
  user,
  withFallback = false,
}) {
  const full_name = user?.first_name + " " + user?.last_name;
  return (
    <>
      {withFallback && !user?.first_name ? (
        user?.phonenumber
      ) : user?.first_name ? (
        <span className={className}>{full_name}</span>
      ) : (
        ""
      )}
    </>
  );
}
