using System.Collections.Concurrent;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace Domain.Extensions;

public static class EnumExtensions
{
    private static readonly ConcurrentDictionary<(Type EnumType, string Name), string> DisplayNameCache = new();

    public static string GetDisplayName(this Enum value)
    {
        var enumType = value.GetType();
        var name = Enum.GetName(enumType, value);
        if (string.IsNullOrWhiteSpace(name))
        {
            return value.ToString();
      ***REMOVED***

        return DisplayNameCache.GetOrAdd((enumType, name), static key =>
        {
            var (type, memberName) = key;

            var member = type.GetMember(memberName, BindingFlags.Public | BindingFlags.Static).FirstOrDefault();
            var display = member?.GetCustomAttribute<DisplayAttribute>();

            return display?.Name ?? memberName;
      ***REMOVED***);
  ***REMOVED***
}
