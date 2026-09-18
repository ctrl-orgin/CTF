FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive
ARG USER="Ctrl"
ARG PASS="CtrlPass"
ARG VP=1
ARG MIRROR="http://linux-mirror.liara.ir/repository/debian/"

RUN rm -rf /etc/apt/sources.list.d/* /etc/apt/sources.list && \
    echo "deb [trusted=yes] ${MIRROR} bookworm main" > /etc/apt/sources.list && \
    echo "deb [trusted=yes] ${MIRROR} bookworm-updates main" >> /etc/apt/sources.list

RUN apt-get update && apt-get install -y \
    openssh-server \
    sudo \
    curl \
    iputils-ping \
    net-tools \
    procps \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# ساخت کاربر و پوشه SSH
RUN useradd -m -s /bin/bash ${USER} && \
    echo "${USER}:${PASS}" | chpasswd && \
    mkdir -p /var/run/sshd

# کپی کردن تمام ساختار پروژه به پوشه خانگی کاربر
COPY ./vp${VP} /home/${USER}/
WORKDIR /home/${USER}

# اعطای دسترسی اجرایی به اسکریپت‌ها و فایل‌های اجرایی
RUN chmod +x entrypoint.sh server agent && \
    find ./challenges -type f -name "*.sh" -exec chmod +x {} + && \
    mv entrypoint.sh /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["./agent"]