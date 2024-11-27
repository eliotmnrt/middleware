using System;
using System.Threading.Tasks;
using System.Runtime.Caching;
using System.Net.Http;
using System.Text.Json;

namespace ItineraryServer
{

    public class GenericProxyCache<T>
    {
        private readonly ObjectCache _cache = MemoryCache.Default;
        public DateTimeOffset DtDefault { get; set; } = ObjectCache.InfiniteAbsoluteExpiration;

        // Get with default expiration
        public Task<T> Get(string cacheItemName)
        {
            return Get(cacheItemName, DtDefault);
        }

        // Get with expiration in seconds
        public Task<T> Get(string cacheItemName, double dtSeconds)
        {
            return Get(cacheItemName, DateTimeOffset.Now.AddSeconds(dtSeconds));
        }

        // Get with a specific expiration time
        public async Task<T> Get(string cacheItemName, DateTimeOffset dt)
        {
            if (!_cache.Contains(cacheItemName))
            {
                Console.WriteLine(cacheItemName);
                var client = new HttpClient();
                var response = await client.GetStringAsync(cacheItemName);
                T newItem = JsonSerializer.Deserialize<T>(response);
                _cache.Set(cacheItemName, newItem, dt);
                return newItem;
            }
            Console.WriteLine("LE CASSSSSSSSSSSSSSSHHHHHHHHHHHHHHHHHHHHHHHHHH a été utilisé pour l'élement" + cacheItemName);
            return (T)_cache.Get(cacheItemName);
        }
    }

}