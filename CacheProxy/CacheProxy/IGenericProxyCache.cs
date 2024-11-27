using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace CacheProxy
{
    [ServiceContract()]
    internal interface IGenericProxyCache<T>
    {
        [OperationContract()]
        Task<T> Get(string cacheItemName);
        [OperationContract()]

        Task<T> GetWithExpiration(string cacheItemName, double dtSeconds);
        [OperationContract()]

        Task<T> GetWithDateTimeOffset(string cacheItemName, DateTimeOffset dt);

    }
}
