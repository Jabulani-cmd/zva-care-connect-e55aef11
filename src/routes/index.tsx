import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { PRODUCTS } from "@/lib/store";
import { ProductCard } from "@/components/product-card";
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingBag, Zap, Crown } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kings Pharmacy — Fast Prescription Delivery" },
      { name: "description", content: "Order prescription and OTC medicines online. Fast delivery across Zimbabwe." },
    ],
  }),
  component: Home,
});

// ── Kings Pharmacy logo (embedded PNG) ────────────────────────────────────────
const KINGS_LOGO =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAACsCAIAAACRsyt4AAAv+0lEQVR4nO2dd3yURf7HvzNP2ZrdTe89EHrvRTooRTwVsYDt1LNzehbOOzlPsZ0NTzwbdooKqIAiIr33EgIkIb33Ldn6PM/M/P7YEEKyCcGfQHT3/coLkt15nmee5/PMzHdmvvMd5PF4KKUQ4I8FxlgUxTa/DUj+h4RSKklSW9/iy5mVAJcTSikhxOdXAdX/yCiK4vPzgOp/ZBhjPot7QPU/OD7ttoDqf3ACqvsjjLHWHwZU90cCqvsjAdX9kYDq/khAdX8koLo/ElDdHwmo7o8EVPdHAqr7IwHV/ZGA6v5IQHV/JKC6PxJQ3R8JqO6PBFT3RwKq+yMB1f2RgOr+SEB1f4S/0hm4OBSFFOVX7d9zOudkaXWVTRBxaGzw4EGpQ0d0N5r0HBd4iTsEcrlcVzoPHcLe4Nq7PWvjukOH9xbymOd5DACMIUbBLSlqNT9gVPK1Nw7qPzhVpW5zLad/olarW3xyZVTfk1VTXC9P6RMarFd1JL0sKy/945sDO88QwjDGiGFADACAIYYoAAVAssz0WtX1cwbP/cvES5v73xutVb8yVeKIbuGbjpePeXnvoh9PuWVCfXnqN8EYe2b+J1t/ysEYOCQAAEOUAWPAGPIu7MAASBCwR5b/9/LG/Nzyy3ITv2OuWA3vksiDnx/bfcYSbxCvHRR1w5DYuBCtz5SH9+fMu/UTQ5gOEEGMP6u0b6gEw6cn/ev529tKIBMKAMLFWABWh1RY46iwuSWFIoSCRCHcIMaFao1aoeMnuYK0LutXzJrTiNz86V0fXZpZY3Z/tK1kw8n6R8bFTR0Q2zrl6RNl2iABIQqMB6wAa1cwjlBXe6/FjpMVY3vFdDCT1WbHyv3lW3OtVVaX5CYKoRghtYCxyMUFa6f3CrlpZCKHUQfP1nm4kkZvenTQI+Pjq11UhWl1nf2+pdn/Wp1pcbSMsBAZbVAIZYAZYgBttgWIccCw1ICumTnYZwK3TO5adNCkU3VEJ0LZrlM1E17d/9620oLyBqdDVggDQJSBU6J2u5RVYlvwQ96013bVNngu6q47A1e4qzN9YNxtg8I9hAdAEWq8fH/VQ19mZhZbmqcZOqpbZGyYIksIGFCflSoDYAxRQqSrZqQNG9WzdYqSeueDn51IT9ENTA27YK5khS7fW377pydEjFWNT6jFi4IAmIHjCuvkp1Zk1tncHbvdzsKV7+A+Pq1LXBgnM0BADTyXUdjw8NLM9cfKKG0s1gaj7vnFsyNjQ4mEEOcz5AZCjKNu6Nkv7r5517T+uszseHL5KUrRvKu7diRLeZX2r3bl6zlop2oBAACmE5QTxfb9efUdOW3n4cqrHm5QzxoU525Uk4mYWhvIk9/kbThR1WTad0mLeXPJnUPGJXo8mFEGDDEGlDGv8U8U2eNyT5nb66XFd8XEhTY/OWUsq9x27WuHsqobHpgQrxE7ZMdkVjrz6yQBcxdKiIDxTpmcrnA2vaM+UWRSW23dtP14R65+GbjyY3MYo0m9w1ccLjfXKwAEAGFEOcb+uTLL5SHXDoz22tvhEabn37i9ML/i8MG8/NN1TrNHQUQQuJBwTdee0X0HpkZGBbc++bZT1S//kOeQ6dxhcf0SjS2+tVrtRqO+9VFqAfMdKg4MgAkYh+gFhHzbCm63dPpU8bafTtab7Q/Mm9KRk14GrrzqABAXqrumR/SyXUVuAhoOAEBASCHszR/zCaU3DYtvSpmUEp2UEk0UIisEGGAO8zyH27DOtmSUP7Mm1+OiMcH8wxOSVELLspt/psxmdY2Z0K/F510jtDEhulrLBc00BoD1es3gZJNP0YsLqpcs3px1tExnFBcunhsT6+O9vCJc+RoeADBCc0ZGC5ysadaN5hFzydIbGwoOnGnZanI8p1aLao0oirxPyT0K/XpP0ZxPTksuj4zop/f1M+p8mIG9+qYufmn9jk0ZhJzX2UuL1M7oE2RTSDu1NgNggBoUPP/quF7x59UijDGH3b3s4823TH5937bsulrzs6/dGNtpJIdOUtYBINKomdIr6vujdcI53TFCsttNFq7L/vjP/cONLYca2sJi97y54cwPx+qitZhxwvwpSYlhQT5TCgL/6gd3zv/zF4rExl3Tt6m8YozvGNOVw6pVRyorzB4ApDlvVIfZZRaq44akBs8eEjc8PaTFaQ8fyv3ynS0Zx8uMIQa1Bj/x/KyUtI6OEFweOtHsS065ddqigwa+ZT1MGBrdxfTO3f06cpIj+Zb535+uqXUjAAR4TI/gf93Qw6hp7+V+84Xvt67Nev5/1/cffJ6FTynLrbZvPVW3+WR5XqUDGAeABIF2idD2STBe3ScmKVIXpG5ZhaxdtefjRVsliSBMgKE5fxk7+46rruxkYGeZffGJWyL3fJJxvNAstqq06yRYcnvPCX0i2hlekRS6MbPmuTUFxO3EiKOMAs+teXRAQrgPe605pzOLFz7xTXFhzWsf3TFoWDrfqvkHAEqpw0NEDCpVm6OwNqtz6cebvvr4kF4vMFAQCGndol9855Ygg++R5stGZ5l98Yko4OFpJp9fhYrsqwNlFnubgVHzqhqeX5v7wurTitvlIogwqtOJS+7qc0HJASC1a8zw8elavfrVp9euXL7Td9AmjIM0QjuS11RZFi1cs3b5Eb2eBwSIccDzf/nbhCsuuU86keoYob7xJpWGbzSVzudEse14ia31UYzBhuMVDy7NWHOgXCGIQ1gnyCqe++vExIEppo5cVxT5m24fLYjIrUifvbv9rZdXe9zyReXcarX/85Gluzafwpx3Cpi53eSWPw/t0Tvxos5z2ehEqgNAQqgQqhO8M6fnf4PsEv1iZ0HzOVmF0PwaxyOf7bv381MVNR4RMwBqVxSFsSHdTFP7R3X8uhFRpiefv84jEYzoz1+fevbxLyvKOjrc5nJJ777yY0FuJS8KgAAAMUJS00NvmD2irU78FadzqR5p1ITpVF4viRZfqTHal2/bnFnn/bO83vn+5vx7Pzr2S5YjQo2bxtF4DGnRYU9fnaJVXVz3ZMzEfiPHpVGCOA07fqD0uceW7959siMHblp/dN/2XL5ZMHYeC9dcN0it6bwuPZ1LdZXAjUzzdoRaV/JMw9Fnv8s+U2H7cPOZWz449t6WErNd0XvNYyQDYImyWJP6gzt6xoVeuDlvzbU3DQnSqxHjeA4VFlS98Ph3K5duUxTfwba9lJXUfvjGFoUoiGHGiDfPoVGm4eO6tTV21BnoXKoDQI9oXZ3UxugI4yW3Z9KbBxb/UmZvkNUYEHhHVxAwngHRqoWXbuwWZuhoz74F6X1T+oxMo4wxRDHGHKBPF+1Y/OpaS32Dz/Rul/TkU8sUj+St2DFGAAgoThqaFBph+nV5uDx0OtXTY3Vnf/WRNwQoVOAEDOfXBAyAeSiePy21f0rLMZO2YIx55PPKsUEr/Pn+MaYwgSqAEGZAsYDWrz72j3nLd2/LlKTzTDxK2dqV+2qyrVgEb/PNGAKKVCKafftosWPj+FeKzjI210SkSWNqHJ9razy0dc2JbERZfFvvCT3DmzwmMksdaocFzp7Ipdb0SQwBAJnQKqvLI1NgjDJQizi+WXMQGx/+xH/mPHPnRwA8AkSZxAkoN7vyjX+um3RD4X2PTm0ab6ksr9/240leIIzxwCgDCQGnKPKQ6wd3j2s5zdPZ6HSqY4SGJgUdKLThNg3gps+Z17sBMDw3NX1Kn8jmiXZt2L1s4U6mBgBgjF1/z/A+T04DgGMFlvs/yzR7ZAoUAE9OM334l4HNDxzYK2723SNXfnaAIRkBhxBwCLkV5ZtPD/2y/dQTT8zo1SfRYNBu35iRl1fdaEQijAABQ2q9+r57xv6Wj+PScAlVtziko4UN3WI00cEXN1LRO163Nc8axLeletNMCQIAN1P+OqHrzEEtB7qt9R5dOMdhHgAUSQ4JarxTj0IxYsECRxhYFRYfpml9gWtvGpqdWZ55pJSduxbVaDhnmfOfT60c2C+u/8Dk77/ehzhAiDtbJyGFKP2GdQ/rlMMyLbhUqhdVNzy9MudIqXvuiLC/T+vKX4xB2z0uGEFHvJuZXWFvzO45pW+U0KodJQrYGwhCLgBgVGTqxjtlDIwqjAAB4iI5SAn10b8KCzPeO2/yzbe+F8mrzrrkIkAMc1hNIPNQ6amjpYwiDjPGzlU8Kq1q5Ng0QbygL8aV55KMwxPK3vy54IttRTzHDAb12zf37Jd0EU3dsULLDYsPm8QLGEQGLfe3aanT+/twqwWAuga3SzprrCEI0au1F6nH7gOnXn14rYwkhFhzYwJ53wPKA1bYOYddFBJueOXdW+MSwi/qKpeByzQOTyizuiTAgAFZrM6Fa7NOl1g6fnik6QImsFNh8SGq52/oMaVPdFtpQoPUcaG6xp8Q3cVKDgAjh/S4d/54jsPAoLnqjGHGMEO0meSgyKRbz4iomI72IK4sl0R1gcf94/RaAQMwHnF5Fa57Ps/ck1XdwcN1KkHLtdUiYDdlfRJMS+4bOLp72EUtZvBitTqKC6q9P1mF9R5Pe0PuV88YcPPdw+wN5EJuk+ByuMZM6cm3mibunFySdh0BTOkTuTmnfv+pOsIQh5jTId332an7x9tuGBwdadK2bZ8DAPAYxxs1pTZ360QKY5N7hv3j2q5hhgsskHtrffYPRxrfM8LgpRvTR3SPAICPF238eskeXo0AwG0jK/c9lZIc2dZJBIGfc8/Eapdr09LDDFBb4+qMMb1B3X9wl/az1Hm4VNacXi28emP3r/YWrzxYWVzr0fGIA7Z4c9GGk5VT+8RN7ROeFK5r61iEgFNzsoWJGAMwAALAKQwQkFtHJ9w/Jsmou8AQN6WsrF62OL0LH6FOpuxsFd1gdxgjtTzPASCVRtEEXdjkfvyRGRrGrVlxELUs8AgBZYCYAmOmpev1ProDnZNL2HMLUgv3jE2d1Dty+e6K93cVajBmFJVWS+9tLliyo3ha9+D7J6XGhvp46BihUB2fC/jsNAzPAFQqeHZmz2v6RPIdqNUVyqpdpF5u3LnQIwPPNSpWXdXQUKdgkSJEXRwxaDq0Vu3Oeyc2uKVtX2dAs+SIIQoEIcEj0bGT+nXkPJ2Ey+RLk1/d8NG2st35dQ6bpDDCIcQYdih0TJfgqQOi+sQbwoNUhrOLBSWFPrn85JZTtSIGAOZQWHyY/qXr0wanhbZ7kXNQSsvqnA73ORs+IULvNejqaq1ulwwACCHMoajojtpfikJeefab3VuyAPDZqh4BMGDAq/kv1zxqNP2aKZ/LwJX0oFIoK6l17sqp251Tvy/X4lYIj4EwYBTFBgup0UHdI3TdY/W9EwwRBs3TX2X+klkrYE7gYebA8HvHpnTcW/LSQQj59L2Na5YfbO5Syyjr0jv6tf/d1Y6nzZWlU/jNOT0kv8a+am/RN4crXYQLERADYAwQQi4KggpFa4EqfJ1DsSvs2Wu7zh4W3XkmMzwe+asV+z95/Ue9TscQZYwQgqZdP/Dhp6ZyHTDgKWV1Da6QIM3lXAnbKVRvosEl/3Kidt2RylKry9oguxWGEeVQU3OOMGLpMerkcF3vhNCkME2EUQxS8Qat2Hok7jKzbOnWVR8ecLskwLKi4LmPTJ5zx/D2OyZNfLatcNnekgcnpI7pHhoS1KFQHf9POpfqXmSF5FfbM0tsmWWOvbn1RfVORrGOR17hCVNchAHDKh5HmoQIgyo+VBNnVCVFGNKjdTEmUdfKN/nysGvLiY8Wba4sr0Wc+Oj8GVP/1L+DB+7Jqr3ni0xMYWiq8ampqemxhkuaT+icqjchE+pwyTnlDeuPlf+YYa5wS5GNixERAGLAGKOAZAQCh4DjsE1BmGM9wzRdY9QDkiJ7xmmTw7SCcJlmERllxYXVzzz7VUVG1XOLbr5qQp8OHvjV7uIFa3ODOGCAnQR9ele34d3aHDD4TejUqjfH6VGOFVp3ZFXvLmqw2RW3y+OSGQMkev1Vzo2UMQCQKTgJJYjpBZwarE6KUCeG6iKDtV0ig7QqrFdxWhFr1YJawBz+7ZuG5WsO9e8Z2z2tzbHh5hTV2P++Kvt0se1ss86CTZqP7+6dGHYJ7f/fjepNNLjkCrMrp8pZWOs8XWY9XWqrdRAXoRiQvtF6apzoBADCGADzMADGGKM6njdqBZ2G16k5g1Zl1HLxBlW4QRVt0hg1KCZUqxZ5Y8f667/BjbjlnVnmL3YVnSqz8OjcLLJE4ZEpifeMTe6gWfAr6ERxaTpIkEYI0ghdYwyUMYUwSaFlFtfJwvrvjpQfKbFZFSQAFyI0utB7B++1CAD4BoUAMKtTsTgVAMRYA0KAEVIYdhGKEHAYUcx6hGj0apwepQ3Vi6mRujC9JiFKz2HQi/xvskzJIZG8MttPGeXrMuvKGyQTFgTU/JljBKTSIhHCcJv+BL89nb2st4NMaEW960hBXUaZLbdGtnuIxeExO2WsUIlSygiHBOG8DhIDwADeoRvc1FLIFFzknC82QSSY5zUijjaqeAGpVepYk8ghJvIMEEsMN3AY6dQiAgQImpdPxsAtKbLCCqrNjEKtTS6qc+bXSQ6J8gjp+HN9k2b1E1UYenhK0t1XJV26vtzvr4bvIDKhDrdSY3NVWqVqq7PKzkrr7PnVtgYnLbbILoVy4B3SZ3qe8zWB5n3iZ12yzv5LGJMYRcwrFTDEAIDRRmcKjFu68BEKDCEOUwBADKk5nw6ATcJTh8JGdzW9cGO3KFObsxL/f/6wqrfAG7+EUMYYc0tKidlVUec8VFBjdau2ZVVVOGTEEAAQRDmGQ0VvA+Fj6UWLswKAr3U5LdJ4a5R2wmV5KxhsIfLj45IfmpxyqYcf/EX19lEUUmF1O9xKYbVdJjS7wumUlUqrbJapLIHD4wEGHoU6FaphICnglhXKkMwYAgTgDUDDOIR41KL5gGZ1BjR/OTy00dNKzXFqNQ4zqHtGi7eMSOoRa7wMi6ICqreJR6EAICnEbPcwxtwydUngkmSPzOwSkSmrtLmdTkVSSLnF5ZQURYZqmyQTqhAwexSX3MI/HwAgWOR0aowRRIXqI/RcjEmTHq2PNqkTw7ShQSK+BN1InwRU//Uw1viPd4Glt3vo/UqSiV0irVdAB4lYFHmARn8MbyficubZy++v59Z5QKjpn3Ofef8TOHylBoZ/HZ1lLivA5SSguj8SUN0fCajujwRU90cCqvsjAdX9kQv015sHX/O6A7f4pNmfCKHGoYw20p+3dITSxnhSCKHWIVwYY5Qy7zwIxr4XnTS/VusLnB82zpu3lvfSKtl552jxVes8+EzQ1lGtw9i1PiGlzJsMIWgaubugBHDxtKe61er49ss9opoHAB5xM24ZWl9r2/zDcV7kFJl07xNrCjEc2nOGMUYJTe4aOXJsz6P78k4eL8IcCg4LumpiL7VG3LHpRHlxPQAkp0SNmNAdIWS12Pdszz55PL+m2iYIXGSUqXf/lCEju2p1jUNI2adK9u3IKi2usZgdQQZNXHx4n0FJfQemCc2iPjLGDu3JycosxWdnwTkOmUIMiSlh3XsnAMD2jSfKSuoAgCi07+DEiKiQnZszZYkwykzh2mnXDUMICvMqd/xykjs7+cEoS+4SMWJsT4RQWUnNpnXH+bNrIgWB0+jU+iB1l+4xcQlhAFCcX7N9Y0ZTRHHJQW9/aJzd4Vy7/AAWzikxdFR6WrcYl8uz45fM2ipr09SsKHKjJvSKjm30xrc3uPZsy8o6WVRdZZEkJTo6uGff5MEj04JDDCeO5x/dW8ALnOxRJs/sHxMX9sOq/Tary3trt94z9lcsrmtPdUeD64v3txhD1ADAY3Hyn/r9tHb/6i/2q9W83Sa99tGd+bkVq77cSSlVZHrVlJ4jxvQ4frhw1Zc7eRVWqYS09JjElPDd204e2HEGYRg9tu/w8d08Hvn9t9bv357NgHlf1JOseMcvp46P7zXvmWsB4MjBnEUvrLWYHTyPGWOA0OG9+T//eGTmDSNm3zW6ydOBMTh84My6rw8KzRY8I4SDjJo/3TbsT7NH7dx88vC+HADweBRBPRYArV6+2+OUCGFde0VPu24oADpxLH/Fp9tUZ2OUEcJ6DkgYdlUPjkPVVeZln2zXas+ueve+WDyOTwp74G/Tu/WMLy6oXv7JdpW68YlbazwzbhlUU21Z8dl2UdWUJRQeaUzrFuNocG/4/mD+maqmkskLXESMyau6zep4cf43uTlllFDvrH1OZvn2TSd7bUp67NmZPMd9/t5Wg0l0OeXoRFNImGHZRzvdbiehLLlLxO33T7hYyaH9dh1hJKo5XuR4kRNUWFHo4R1FeoOKE3BIhLb/4C4IEC9iXuQEVWOQdo7HgooTRM7tkk6fKPLeHq/ieJHjVRgA9u86vX3DScwjjsOiiuMFzPGYAV3/7aEjB7MUhXy+eKvT6RZVHEJgNOkxBkHEikQO7csy150XCwpzSFA1Zg8QQhhxAnI63e+98rPN6uR43Jhzked5DmHghcasNjmul5XUabSiNxkvcqKar6owe+tPjJB49uS8yCGEBYHDGBWeqd7683FCKMJIEM8l0Bj58vK6ulqbSsPz4nkHAoDT6XG6PM3TU8ps5sYZkO+/2pubXYYQYIxElSBqBI5HPI8zjxdt//lUj95JYVFaTsBqrXDqRHFNlYUhwoscYzBpRkcdcy9C9fNfAVRaVO2S3ACgyHTKtQPbT86L3PZNJ1p/fuJYgXC2KMz9y/i5fxnvcSsAoNZyu7aedjjc3k0ZGYOgYM2SVfOumtiLKBQh8Hhkl9N3HFlZIrfdM/bOhyZ6XAoA8CKurKi74A1RQqvL7MgbrQ4hxgAhqC1vkCWlRUqPizzz8o2hEQYA4ARcmF9JScvNwzgOlxbVVJaZfbazdpvbXOc4O2yPAIBSVlttI4S6XJ7SwjoGDADcTuU/7/15wSu3KhIFAASsvLxWlpUxU3oThQoiV5hdU1ZS6935RKXi+vZPu+Bt+uQibPhTGaX2BhcAYIwGj0i/wHkxysooq660tLDUigurvO0oAwjSa43BWqIwAOB4XHCmQpEUhTQuTsMcQgBUgQazx2Hz1NU0uFy+N2dgBEJCTeMm95NlCgAIg8tx4U2X3G7J7ZK8esfEBxOFAAAhtKrCfN7JGSOEduuZEBJq8FpRNouz9WaTvIjzz1RWFFt9qu5ocNttbgDgRd4QrPFm0my2EUKIQmVFaZyWZ6DTqTGHvbHVACF7g5ModOCQLorMAMDllE8dL6aUMsZSukWZ2tj38IJ0dM6NIZqXU+6t/VK6RMbEXXhRoCByu7adaGFkEoUyys7NODLEKCIKY4zZLJIgCjzmAAAhqCq2bd+ccf/fpt3718Ztm9qL0ckANXu9WmiiyESWWkYecDo9HskDAITQLt1jC3JqQABOwPl5FUmp58Wg9RZEdLaA6IPUrS1nhFBJgSXYpPNmvsVbUVdn824nrNerE1JCMw4VIYRqa2yKQgklCiHN3XNQ49QeIABFIYyx2PjQsGh9g8UlKXJuTgVjjBGWmhbbZP9eLB1VnSgk+1QZxohSlpwWYwy+sP82L3I/fX8ktWsURueet+RRmpf+nn0TX/rfrd7fVSpRH6SJigspLqrmeKzRC28+t2bStUXTbxya2qVdb3MEHlk6c7rU63DIGOBm7q2CyG388djeHVmy57yYgk6Hx+mQAIBRFhUdqg1SyZKMMcrLKR8/uXl7iQSB27DmcGW5GSGQPCQ01NT8FlQakReww+a2WRoYUwAgNCLIXO8g8rlWoKba7H0pBYGPiQ/JOFSEEFRXWBSZMMrI+UFLGQOiMABGKZM8CmPMFKpPSYk+djjf6XAXF9QghAQ116V7zK8OjdHhss6Yp3EBMMQnhwi+Que3ACFw2j3Zp8oRRqz1xlcIPB6prLiGnq3SJUnCGN3xwIRjh3M9LoUXsFrHb//lxNH9BTNmD7rhltFtXUgQ8aqluxijah0PAJRQo+Gc8yFCYDO7bGZniwJqszocjsYGKyzcEBKuqyqzcDw+vCfv3ofPuwtRxX39+Xavi+Ok6f2mzBjEceduXxT5kDCt3eq2mO0NDU5FpkmpERZzYfNrVZU3tnQCJyQkRnm7L1VlNqJQ1KqNjU8Ke/7NuQDAGAsyaFVqESEUkxB67HA+JdTtlABAq1F36xXX3tNvl4v2qqCElRaaCaEddBeX2o61Xl9n+/KDbXU1NgCglAWH6VesfzomLvTLtU8tnL8841AhL2CMkd3u+PSdzYrEZs0d7TMkL8LIarZ7Ry8oodEJIYkpLcOEe4215phrHZY6h6jiBZFTa4X4xJDyonpe4HIyq1qOqDBAgAExSsBiadAb1S1OlZAcUZBTI0uKLIEsk8gYUwtzr6KsznsIL+CQMJ33BaKUFhdVJraKj6LTq/sMTG7xYb/ByRvXHaWUePNjDNbFxl94E8q26Kg1hxDyDtdgjMrKahpsjvbTG0N04oXWcwsCFxEdpNGJWr2oCxJ1+sZWShT5J/51w6zbR6v1onf3JbWG37z+aHGh73hGlLLYhNBe/ZIGDuk6Y9bQxZ/f3/xbQlhKl4gBQ9Lw+a+pzeZiFABApRF0Qaq4xAjvnxijutpz2w8wBh43efrF68MiDJhDB3flrViyvXmdzBiLiDY2+dVQyiKiQlr40Rbl1SKMKWUavdhkFWKMfEahdzo9pzOLvT/FhdXeJ5DSJQqdFcvjUcZP7dX+s22fjpZ1zOHElPDszHKMUX5OVX2twxTse+MkAGCMxcSHul3u/OyqNocMGZhCDDfOGfnCk99ogxrNNElSNm04bK13AoA2SPjny7e89/q60sI6hFF1pbWyzJyU4mMhoCLRa64bMmp8d1HgBVFoUR8QhQ4Z1TW9Z/zpk8WeZts1W+ptmGu0Aw7uyS4prvEOtAmqFh0/RghN754QEmaoqbIJIldVVU+aNViUsbBwE5Gp961SPCw8wgTNirrN6rRbJb1RRAi5Xa5d2zI5DlHGMIdysyuGjere4nbKi+tefXYlIMQo69U/4eEnr9VoVcEhhuh4Q0lBLcJI9pB+g35ln81Lh1VHXFJKdPaJcgBw2Nw5p0tTurS32QLPcWMn98k6vkF1/v5KarVAKPOGmuQ5LjjM0PwJSh55zdKDFeW1jIHOoFqxfuTocX2//HCToOKIwtzONhoLBiLPB3UgrlBzzPV2r4Xlckhrvz6AMeY4BAA8j8uK66Oiz4VFZIwhdM4i9bg9LWz04BA9bex8gVrPq9UioaTpdS8trm5qvAtza/Jzqr19V4xRVmYJwhh7Q9qdfVcJoQ02J0KIEqYopNGeR0jU8I3rMxgTL3LPgxZ0uIYH1KVHtEanAgBe5PZsz2w/PSGkT78Ut1Np0UTqz4ZZZQCEUo/L09ycEVWCRqsS1byo5nkBI4RUKr5pC1Sf+/D8airK68/2Hxmj0LSRH8ejgjOVbR2FEJKl83b3Y5QJIm8MVzEGlLDUbi2b24ry+nND/QyI0tjb53ice7IGI6RWneuREkIpZZR4Z5aYKAqotb33/6ajZ2SMxcSGqtUiAHAcOrKn0GZztn+IIVjXf0QSpefZNXFJYfTsQ8vNLj984Ezz7oAgcCHhOsYYQtBg8Zw+WZSXW+4dsuB4pPtNIzuUFNR6n2eQUfvQUzPufmSSd2gPc7i63Pc2AD5BCBCg9F7RXsHSurU0rfNyynFjl5L1HZL83Btz0Nnos5QQt1symfTeF4EX8JGDOWeyS70vOiUsODioI92li+VCqp99qxljYRFGjVrVWN4QO7DnVPME59IBAGusAidPHyC5z+uMTrx6EFUYowwh+GHlwW+X7ldrhKZhDYTQsDHpHhdhDAQRP3bXkq0bMngeU8oioo3hUa2D0baabW3rFs5b8Q6MgbnG4a1VtRpV995xA4akKQoFAIyRw+GW5Zbjsq0eSdOvCBD0GZBMZEoITUhuVtYZA4CcU2W8gAFAlkhKl8g+A5MFteDVFfOorLim18AEDnOMMVHN/e/V9R++9bMgcowxXZC6Z//484zQFvfya7mA6hzPYQ5jDnMc5nk8aHQKoxRzWKMVt/x0AmOEBexN4G2WEAaORxyPvW93n/6pOoMKc5jnsbeWi0sIu/+JawwmnduhMMJ0QapZd4yMjDbxfOOazgnX9L/57tGh4QaPSxEEjipMlkhiSsSsOVclJEWclzeMvdnjBYxa9ej4ppx7a1eMRBXv3c1XEDhzvQ0YcDzGHFZrBLVGNJp0HNd4L4okO50Sz3sP57ztPcdhjscchwWBQwAYI17gMIc5jBll8YnhgAAjFJcQjtDZ5yZgzEF1eYM3JcY4NNzI85wpWOP9RKMVK8rNo8b1mjV3VFiEyVvZIAaSmyQkR9xx/8TBw7udu18OezPcwQ2j26G9tS+ypBTmV3v75Qih+KQwh8NdU2nzKooQCg3X19U0MAbeFzMqOri+1maudyCE1BoxMtoEAKXFtUShAEwfpI2IMgKAopCqcnNJUa3N6kxIDu/SLbaqwux2yRijpNRIAGCMVZaZK8vr62vtCENUTEhEtDE0zNCiO1BXY7WYnQghRll4lNFgPM+aqyq3OBxu79lCQnVqjaq60kIIAwC1WgiNMJQU1ng9F0SRj4oNxhjn51R4C5YgcMZgbU2VzXtFSmlyWlRVudntlgFAELm4hDCH3V1VYfG6hEREmTgOlxTWAILYhFBgUFHWOJgfFmGorbJ5iwSlLCLKaDBqiwtrFJkAAGMQEqYLDgkCgIqy+uoKS0VFPQKIiDTFJ4eHhZ9Xt5WV1Hk3miOEJqVECB3bSx4CK578k069Y2eAy0ZAdX8koLo/ElDdHwmo7o8EVPdHAqr7IwHV/ZGA6v5IQHV/pFOoXlJU/eIzy1psdf175+ihnIaGC0xGXymupOqEULvdVVNleetf3wfp9KJ4hcM4McZ+K8eNH789ePek9/duP/2bnO0357JGHrNaHVXl9SldYnieU2Ty3bI9Rw/mS5KUeaI4NuU33uvS3uDSB2kAwOOWVOoL7P/mZc23B2Liw4YMSW3+YZM3MCHU7ZZ0HVt4QCQ6657hQ0d3aycNpfSyBRpswWW6quSRP/jvD3dOfWve3CWbfjoCAMcP5739/I9HD+VlHClSZNJnQKrPA48fzn3nte+9v9fVWi3mRi+XuhrrWy9++/KzK5pSMsYOH8i2Wu0AkH2q5L7r3gWAnZszl3+6pSi/aueWjIK8Nv2iAMDjkRc9933W0aLmxX3pkl9umfSff8//QpaUl/62KjerLOd06aafDjt9rahyuxqX4VWW1/cYEPfEwuuMxka3/I/+u37O9NcarOcq/M8//Pmm8a9+sOiHdh/bpeKSl3WPRz6y78x/nl1tb/DEp4bVlNmGjEgHAIvFPu+Fq1d+sufqG/vHxYePGNfSVRQAjh3Knf/A5wnJEQBQXWWdd/OSOfNGTpgy4Idv973yt+9j00yU0rK/1MbGhdXVWO+/5R3ZyV7+4A4pQnnlmVVh8Tqrxf7ua2ury+wf/GcTxmjGTYP+/vJsn5msLDe/+uzXao2Qd6bMq3r+map/P/VlVEh4bHJwbmb1zi0n9+zN3PDTQUbAYyNvrbhz9PjeJzOK7v/T+8PHdHvx/ds++u+GnQcLlq14eNuGjH88tGzW7cPnLZhJKcvNLn/hqRUlBbVqlejxyDrKck+XP/f0sqTkyOjk4JzTpZfy2bfJpS3rsqR8/en2v9+7NDU9av5Ls3r1TTCXO70F5arxfQqz6oZelX73A9dMnj6odc15/HDePx/50hCkf+Tv010uzzuvrJGoa/Dw9F9+OLL4hQ0z5g6YfdcoWaK7tmVYzA1vLfy+ttL56LPXmkJ0zzzwpbnGcc+jV+/YklFb4Rg+vust946OSQgeNaGHz0yWldSt/mrnvGdmhkfrzbU2xqAgt+qFJ1fMvGn4nY9NwIxb8PrNWzceM4Xop984aOS49L5DE3v2TawsN7/z4jpVEHf3E+M3/nj0y8U7Zk7ttX/X6VcXrEpIDp1+8xCe57IzSxfMW+ZyupPTw2fdNcIUos/Lrlj49Ne33D1m7r3jAXH3/XX6JX3+bXFpVf/5h4Ofvr153r+nPb/odp5HP60+8uCCSTFx4QCwZuWu7RtPTLlukM8DrRb7uy/+VF/u+tei2aldYx6c8+6erVl3z7vaYNS/++r6WXcPf/Lfs2qqrPUVjkFD0nduPH1wV+6Sbx/pPSBx4eNfFxZWXnNTv159E8dPHjBqUo9/vnJLTV3dlBv6jRjX0+e1vv5iy6RrBiSlRhv1+uTkWIzQ0g+3pHaNSOsW+e7L6x76+7Qu3eLGTOx7+wPj/7bgellRHl0wLTTM+POaQ0d3F77w9q0RkcafvztkilJPnDrg26V7zWXO+a9e37V7LAAs+OuXRpP23aUPvfj2nXPuncDz3JJ31qf3ijEYxLdfWvP4MzO6dvO9efyl5tKq/vo/1lx/x/AZs4YV5FV88eGmmGTTrX+e4HZ5tvx8ZNXSfT36JialRlBKiwurmxpFL6cyikqKq5dteVyR6Lw7PqyttA0akTZoROqPq/ebTPrpNw4RRb6y3NJ9SDTP8z99d/DeR6YIAvf6s98GhajdVuXmO8ZUVpg//WDDvGeuPbQ3Z+uq7FvvGl9bbS0parl65o2FK2UPjYoJqa22Mo5O+VP/rJOlv/xwvLSkvqaq4d3lDyalRmWfKq2prp9wdb/33/jRYND3GZiad6bi53WH5y2YPvyqHqdPlJw5VTF/4awTRwuzM0v/88XcAUO6ejzy6uU7qQs9+/rsyOjgmLhQYOzIgdzdm3LKSmolmbz/1cMJyRGnM0su6fNvi0vbruuCVEEm1Zqv9+7ZeaLfoNRD+3J3bTuRfbKsR58EKjGO4yz19s/f35zWLTIyOvi8bPG8KVy3dsX+vTuyBgxLKcmtuWHu8B9XH+A5Xh+k1ulVFWV1VrPDaNJknSzhVWjHlszVK/YMGdGloqI+JFa34bsjVptj9pyxQQbtj98cjuthWvnZTpvVMeuOlkskPW5524ZTTqccFWecOXv4/l1ZwaEGItNBw9MmTOnfYHOu/HS31shfd9NIl8P9zSd7x87ovnjhD2HxOkHFJXQJ27Yp49O3Ng8e1SU3u8Rg1Ikqoa7GlnEsb/O6DLdbUukF77KvspLan9Yc5DkOc2jAsLTxkwc02FzfLdtjCNb06J1wSSXwyaX1m1vx6eZFz2yISzd+suaxFR9vX710t6uOLlxyc1Jq5M0T3zCFavKqrW+8edPUmcNaLMq1mBsevnFJXkH5Y89Nq6q0GAwaS427S4+48VN733vj2+YaV32ZY+4To+b8eaJGK678bNebC9aMmp72yFPXPf/EV2VFdf0GJz/zyuzgkCCPR37sto9zC0vDjcEvfTQnsdWCqfLSuhtGvWKMVAPBThUsemtO/0FpM8c8TySWkBaae7J69l0j73xwEi9w1ZWWmUNeVAfx028Y/PA/Zry1cPWmtZnWcvejL1190+1jgIHD4Vrw6LL83Ap7vXTnvAm33TP2msH/iksJCQnXnt5f9cQrM8dN6Ttl4AJBxImp4fkna257cMyce8bxl8DdvQWX21vS7ZLWrNozfkr/0NCg1Z/v2fTTsXkLpvfoneSwu++6+r8hsdq5D4wbOdZ3c5txNI8QolarX//3t13TY7Si9oG/X8MLXF5O+aqlu/oPTZk8rdEmcLk8+WfKe/ZJdjo9S97aqDXiO++/uuk1OnIgZ9e2U3PvmeB1RW3NieMF3y3bExYddOOtV0VEmgBgy/qMpR9slR3sjsevGju5H3/WE3nFZ5v1Bu2U6YNFkS/Irfzvv9eNv67XjBuGN51q+6aM1Z/vnT574MSpAzDG677Zv+KjXZhxT746ve/ANADYuO7Isvd28Dx312NjR43r/ds85QtxJX1kJY8MCJoG4GqrrYKKb+rR+kRRyOJX1q375sDYyb2feP56jfZy7GoKAIwxe4NLEPj2omMAUMp8rqxugijEYrZrdeqmnDPG7A1ulYq/4ILf35DfmWd0daX1T6MWjpzc7cW377hsW3H+8fideUa//fK3CWnhDzw+LSD5b0unVr2spO7uhyf6XLMe4P9Dp67hJY8sCHzrNWwBLorf2W4/l9Pk8Ss6dQ0f4BIRUN0fCajujwRU90cCqvsjAdX9kYDq/khAdX8koLo/ElDdHwmo7o8EVPdHAqr7IwHV/ZGA6v5IQHV/JKC6PxJQ3R8JqO6PBFT3RwKq+yMB1f2RgOr+SEB1fySg+h8cnzumBlT/g+MzpF1A9T84AdX9DoQQx/mIgBJQ/Y8Mz/tevRpQ/Q8LxthnQfd+FRD+DwjGWBTbDKqDRVEMCP8Ho33JAQB5g+USQhRF+W23tQ9w+UEI8TzfVsV+LllzpQkhlFJKaUD+3xcIIYxxOw15y/QBgf2QQIvujwRU90cCqvsjAdX9kYDq/khAdX/k/wAYDllyZXGGQAAAAABJRU5ErkJggg==";

// ── Hero slides — real Unsplash photos of Black pharmacy professionals ─────────
const slides = [
  {
    id: 0,
    Icon: Zap,
    label: "Fast Delivery",
    title: "Prescriptions\nDelivered Fast",
    sub: "Order before 5 pm — our pharmacists pack and dispatch to your door in 30 minutes across the city.",
    cta: "Order Now",
    route: "/checkout",
    // Black female pharmacist handing bag across counter
    img: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1400&q=85&auto=format&fit=crop",
    overlay: "from-[#0D2249]/90 via-[#1B3A6B]/80 to-transparent",
    accent: "#93C5FD",
    badge: "bg-blue-400/20 text-blue-200 border-blue-400/30",
  },
  {
    id: 1,
    Icon: ShoppingBag,
    label: "Shop Online",
    title: "200+ Medicines\nIn Stock Today",
    sub: "Browse our full catalogue of OTC and prescription products. Real stock, real prices, updated live.",
    cta: "Browse Catalogue",
    route: "/catalogue",
    // Black male pharmacist reviewing medication at dispensary
    img: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1400&q=85&auto=format&fit=crop",
    overlay: "from-[#0A3622]/90 via-[#1A7A4A]/80 to-transparent",
    accent: "#6EE7B7",
    badge: "bg-emerald-400/20 text-emerald-200 border-emerald-400/30",
  },
  {
    id: 2,
    Icon: Crown,
    label: "Loyalty Rewards",
    title: "Earn Kings\nRewards Points",
    sub: "Get 5% back in loyalty points on every order. Redeem for discounts, free delivery, and exclusive offers.",
    cta: "Join Free Today",
    route: "/account",
    // Black pharmacist smiling with customer in modern pharmacy
    img: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1400&q=85&auto=format&fit=crop",
    overlay: "from-[#3B0764]/90 via-[#6D28D9]/75 to-transparent",
    accent: "#DDD6FE",
    badge: "bg-violet-400/20 text-violet-200 border-violet-400/30",
  },
];

// ── Category pills ─────────────────────────────────────────────────────────────
const categories = [
  { emoji: "💊", label: "Prescription", route: "/catalogue?cat=prescription" },
  { emoji: "🩺", label: "OTC Medicines", route: "/catalogue?cat=otc" },
  { emoji: "👶", label: "Baby Care", route: "/catalogue?cat=baby" },
  { emoji: "💆", label: "Vitamins", route: "/catalogue?cat=vitamins" },
  { emoji: "🩹", label: "First Aid", route: "/catalogue?cat=firstaid" },
  { emoji: "💄", label: "Cosmetics", route: "/catalogue?cat=cosmetics" },
];

// ── Trust bar items ────────────────────────────────────────────────────────────
const trust = [
  { icon: "🚀", title: "30-Min Delivery", sub: "Across the city" },
  { icon: "👨‍⚕️", title: "Real Pharmacists", sub: "Every Rx verified" },
  { icon: "🔒", title: "Secure Payments", sub: "EcoCash & cards" },
  { icon: "↩️", title: "Easy Returns", sub: "Hassle-free policy" },
];

// ════════════════════════════════════════════════════════════════════════════════
// HERO CAROUSEL
// ════════════════════════════════════════════════════════════════════════════════
function HeroCarousel() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((idx: number, d: 1 | -1 = 1) => {
    setDir(d);
    setCurrent((idx + slides.length) % slides.length);
    setPaused(true);
    setTimeout(() => setPaused(false), 6000);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setDir(1);
      setCurrent((s) => (s + 1) % slides.length);
    }, 5500);
    return () => clearInterval(id);
  }, [paused]);

  const s = slides[current];

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-2xl select-none"
      style={{ minHeight: "clamp(300px, 42vw, 520px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background photo layer ── */}
      <AnimatePresence initial={false} custom={dir} mode="sync">
        <motion.div
          key={`bg-${s.id}`}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img src={s.img} alt="" className="w-full h-full object-cover" loading="eager" draggable={false} />
          {/* Directional gradient — text readable on left, photo visible on right */}
          <div className={`absolute inset-0 bg-gradient-to-r ${s.overlay}`} />
          {/* Subtle vignette bottom */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ── Text content ── */}
      <AnimatePresence initial={false} custom={dir} mode="wait">
        <motion.div
          key={`txt-${s.id}`}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1], delay: 0.06 }}
          className="relative z-10 flex flex-col justify-center h-full px-6 md:px-14 py-10 md:py-14"
          style={{ minHeight: "clamp(300px, 42vw, 520px)", maxWidth: 560 }}
        >
          {/* Label pill */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest border ${s.badge} mb-3 md:mb-4`}
            >
              <s.Icon size={11} />
              Kings Pharmacy
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-white font-black whitespace-pre-line leading-[1.06]"
            style={{
              fontSize: "clamp(1.8rem, 4.2vw, 3.2rem)",
              letterSpacing: "-0.025em",
              textShadow: "0 2px 16px rgba(0,0,0,0.35)",
            }}
          >
            {s.title}
          </motion.h1>

          {/* Sub-text */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mt-3 text-white/85 leading-relaxed max-w-sm"
            style={{ fontSize: "clamp(0.84rem, 1.55vw, 1rem)", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
          >
            {s.sub}
          </motion.p>

          {/* CTA — wired to navigate */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
            <button
              onClick={() => navigate({ to: s.route })}
              className="group mt-6 md:mt-8 inline-flex items-center gap-2.5 rounded-full font-bold
                         px-7 py-3.5 text-sm md:text-base bg-white shadow-xl
                         hover:shadow-2xl hover:scale-105 active:scale-95
                         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/70"
              style={{ color: "#1B3A6B" }}
            >
              {s.cta}
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* ── Prev / Next arrows ── */}
      {[
        { label: "Previous", onClick: () => goTo(current - 1, -1), pos: "left-3", Icon: ChevronLeft },
        { label: "Next", onClick: () => goTo(current + 1, 1), pos: "right-3", Icon: ChevronRight },
      ].map(({ label, onClick, pos, Icon: I }) => (
        <button
          key={label}
          onClick={onClick}
          aria-label={label + " slide"}
          className={`absolute ${pos} top-1/2 -translate-y-1/2 z-20
                      w-10 h-10 rounded-full
                      bg-white/15 hover:bg-white/30
                      backdrop-blur-md border border-white/25
                      flex items-center justify-center text-white
                      transition-all duration-200 hover:scale-110 active:scale-95
                      focus:outline-none focus:ring-2 focus:ring-white/50`}
        >
          <I size={20} />
        </button>
      ))}

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-300 focus:outline-none"
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              background: i === current ? "white" : "rgba(255,255,255,0.45)",
            }}
          />
        ))}
      </div>

      {/* ── Slide counter ── */}
      <div className="absolute top-4 right-5 z-20 font-mono text-xs text-white/55 tabular-nums">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>

      {/* ── Progress bar (auto-advance indicator) ── */}
      {!paused && (
        <motion.div
          key={`bar-${current}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5.5, ease: "linear" }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/60 z-20 origin-left"
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// PRODUCT IMAGES — real Unsplash product photos mapped by product id
// ════════════════════════════════════════════════════════════════════════════════
export const PRODUCT_IMAGES: Record<string, string> = {
  // Paracetamol / pain relief tablets
  "1": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80&auto=format&fit=crop",
  // Amoxicillin / antibiotic capsules
  "2": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80&auto=format&fit=crop",
  // Vitamin C supplements
  "3": "https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=400&q=80&auto=format&fit=crop",
  // Baby formula / infant nutrition
  "4": "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=400&q=80&auto=format&fit=crop",
  // Blood pressure monitor
  "5": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80&auto=format&fit=crop",
  // Ibuprofen / blister pack tablets
  "6": "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80&auto=format&fit=crop",
  // Body lotion / skincare
  "7": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80&auto=format&fit=crop",
  // Diabetic test strips / glucometer
  "8": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&q=80&auto=format&fit=crop",
};

// ════════════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ════════════════════════════════════════════════════════════════════════════════
function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
      {/* ── Hero ── */}
      <HeroCarousel />

      {/* ── Categories ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-0.5">Shop by Category</p>
        <div className="flex gap-3 overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0 pb-2 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.label}
              onClick={() => navigate({ to: c.route })}
              className="shrink-0 flex flex-col items-center gap-2 bg-white rounded-2xl px-4 py-3
                         border border-slate-200 min-w-[90px]
                         hover:border-[#1E5BC6] hover:shadow-md hover:-translate-y-0.5
                         active:scale-95 transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-[#1E5BC6]/30"
            >
              <span className="text-2xl leading-none">{c.emoji}</span>
              <span className="text-xs font-semibold text-[#1B3A6B] whitespace-nowrap">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Flash Sale Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A7A4A] to-[#0F5C36]
                   text-white px-5 py-4 md:px-8 md:py-5 flex items-center justify-between shadow-lg"
      >
        {/* decorative circles */}
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/5" />
        <div className="absolute right-16 -bottom-8 w-20 h-20 rounded-full bg-white/5" />
        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-wider text-green-200">
            🎉 Flash Sale — This Week Only
          </div>
          <div className="font-black text-lg md:text-xl leading-tight mt-0.5">
            20% off all Vitamins &amp; Supplements
          </div>
          <div className="text-white/65 text-xs mt-1">
            Use code <span className="font-bold text-white bg-white/20 rounded px-1.5 py-0.5">VITAMINS20</span> at
            checkout
          </div>
        </div>
        <button
          onClick={() => navigate({ to: "/catalogue?cat=vitamins&promo=VITAMINS20" })}
          className="shrink-0 bg-white text-[#1A7A4A] font-bold rounded-full px-5 py-2.5 text-sm
                     hover:shadow-xl hover:scale-105 active:scale-95
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/60 ml-4"
        >
          Shop Sale
        </button>
      </motion.div>

      {/* ── Featured Products ── */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-black text-[#1B3A6B]">Featured Products</h2>
          <button
            onClick={() => navigate({ to: "/catalogue" })}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#1E5BC6]
                       hover:text-[#1B3A6B] transition-colors group focus:outline-none"
          >
            See all
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} imageUrl={PRODUCT_IMAGES[p.id]} />
          ))}
        </div>
      </div>

      {/* ── Trust bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
        {trust.map((t) => (
          <div
            key={t.title}
            className="flex items-center gap-3 bg-white rounded-2xl border border-slate-200
                       px-4 py-3.5 hover:border-[#1E5BC6] hover:shadow-sm transition-all duration-200"
          >
            <span className="text-2xl leading-none">{t.icon}</span>
            <div>
              <div className="text-xs font-bold text-[#1B3A6B] leading-tight">{t.title}</div>
              <div className="text-[11px] text-slate-400">{t.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer brand strip ── */}
      <div className="flex flex-col items-center gap-2 pt-4 pb-6 border-t border-slate-100">
        <img src={KINGS_LOGO} alt="Kings Pharmacy" className="h-14 w-auto object-contain" />
        <p className="text-xs text-slate-400 text-center">
          Kings Pharmacy — at your service &nbsp;·&nbsp; Powered by{" "}
          <span className="font-semibold text-[#1B3A6B]">MavingTech Business Solutions</span>
        </p>
      </div>

      <div className="h-4" />
    </div>
  );
}
